import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { PdfDropzoneComponent } from '../../shared/components/pdf-dropzone/pdf-dropzone.component';
import { InvoiceFormComponent } from '../../shared/components/invoice-form/invoice-form.component';
import { ValidationResultModalComponent } from '../../shared/components/validation-result-modal/validation-result-modal.component';
import { InvoiceService } from '../../core/services/invoice.service';
import {
  InvoiceExtractedData,
  InvoiceExtractorResponse,
  InvoiceValidationRequest,
  InvoiceValidationResponse
} from '../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-validation',
  imports: [PdfDropzoneComponent, InvoiceFormComponent, ValidationResultModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-validation.component.html',
  styleUrl: './invoice-validation.component.scss'
})
export class InvoiceValidationComponent {
  private readonly invoiceService = inject(InvoiceService);

  protected readonly extractedData = signal<InvoiceExtractedData | null>(null);
  protected readonly isExtracting = signal(false);
  protected readonly extractionError = signal<string | null>(null);
  protected readonly isValidating = signal(false);
  protected readonly validationResponse = signal<InvoiceValidationResponse | null>(null);
  protected readonly isModalOpen = signal(false);

  protected onFileSelected(file: File): void {
    this.isExtracting.set(true);
    this.extractionError.set(null);
    this.extractedData.set(null);

    this.invoiceService.extractInvoice(file).subscribe({
      next: (response: InvoiceExtractorResponse) => {
        this.isExtracting.set(false);
        if (response.success) {
          this.extractedData.set(response.data);
        } else {
          this.extractionError.set(response.message || 'Error al extraer datos del comprobante');
        }
      },
      error: (error: unknown) => {
        this.isExtracting.set(false);
        this.extractionError.set('Error al procesar el archivo. Por favor, intente nuevamente.');
        console.error('Extraction error:', error);
      }
    });
  }

  protected onFileRemoved(): void {
    this.extractedData.set(null);
    this.extractionError.set(null);
  }

  protected onValidateInvoice(request: InvoiceValidationRequest): void {
    this.isValidating.set(true);

    this.invoiceService.validateInvoice(request).subscribe({
      next: (response: InvoiceValidationResponse) => {
        this.isValidating.set(false);
        this.validationResponse.set(response);
        this.isModalOpen.set(true);
      },
      error: (error: unknown) => {
        this.isValidating.set(false);
        console.error('Validation error:', error);
      }
    });
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }
}
