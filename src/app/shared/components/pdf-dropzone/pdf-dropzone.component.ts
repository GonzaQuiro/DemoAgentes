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
  protected readonly pdfObjectUrl = signal<string | null>(null);

  protected readonly hasFile = computed(() => this.file() !== null);
  protected readonly fileName = computed(() => this.file()?.name ?? '');

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  protected pdfUrl(): SafeResourceUrl | null {
    const url = this.pdfObjectUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
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
    if (file.type !== 'application/pdf') {
      return;
    }

    this.revokeObjectUrl();
    this.file.set(file);
    this.pdfObjectUrl.set(URL.createObjectURL(file));
    this.fileSelected.emit(file);
  }

  private revokeObjectUrl(): void {
    const url = this.pdfObjectUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.pdfObjectUrl.set(null);
    }
  }
}
