import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  computed,
  ElementRef,
  viewChild,
  OnDestroy
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-dropzone',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-dropzone.component.html',
  styleUrl: './pdf-dropzone.component.scss'
})
export class PdfDropzoneComponent implements OnDestroy {
  readonly fileSelected = output<File>();
  readonly fileRemoved = output<void>();

  protected readonly isDragging = signal(false);
  protected readonly file = signal<File | null>(null);
  protected readonly fileObjectUrl = signal<string | null>(null);
  protected readonly fileError = signal<string | null>(null);

  protected readonly hasFile = computed(() => this.file() !== null);
  protected readonly fileName = computed(() => this.file()?.name ?? '');
  protected readonly isImage = computed(() => {
    const file = this.file();
    return file ? file.type.startsWith('image/') : false;
  });
  protected readonly isPdf = computed(() => {
    const file = this.file();
    return file ? file.type === 'application/pdf' : false;
  });

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  protected fileUrl(): SafeResourceUrl | null {
    const url = this.fileObjectUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  }

  protected imageUrl(): string | null {
    return this.fileObjectUrl();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  protected openFileDialog(): void {
    this.fileInput().nativeElement.click();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  protected removeFile(event: Event): void {
    event.stopPropagation();
    this.revokeObjectUrl();
    this.file.set(null);
    this.fileInput().nativeElement.value = '';
    this.fileRemoved.emit();
  }

  private handleFile(file: File): void {
    const isValidFile = file.type === 'application/pdf' || file.type.startsWith('image/');
    
    if (!isValidFile) {
      this.fileError.set('Solo se permiten archivos PDF o imágenes (JPG, PNG, etc.)');
      setTimeout(() => this.fileError.set(null), 4000);
      return;
    }

    this.fileError.set(null);
    this.revokeObjectUrl();
    this.file.set(file);
    this.fileObjectUrl.set(URL.createObjectURL(file));
    this.fileSelected.emit(file);
  }

  private revokeObjectUrl(): void {
    const url = this.fileObjectUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.fileObjectUrl.set(null);
    }
  }
}
