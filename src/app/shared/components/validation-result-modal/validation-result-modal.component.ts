import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed
} from '@angular/core';
import {
  InvoiceValidationResponse,
  getValidationResult,
  formatCuit,
  formatDate,
  formatCurrency
} from '../../../core/models/invoice.model';

@Component({
  selector: 'app-validation-result-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './validation-result-modal.component.html',
  styleUrl: './validation-result-modal.component.scss'
})
export class ValidationResultModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly response = input<InvoiceValidationResponse | null>(null);
  readonly closeModal = output<void>();

  protected readonly resultType = computed(() => {
    const resp = this.response();
    return resp ? getValidationResult(resp.Resultado) : 'pending';
  });

  protected formatCuitValue(cuit: string): string {
    return formatCuit(cuit);
  }

  protected formatDateValue(date: string): string {
    return formatDate(date);
  }

  protected formatCurrencyValue(amount: string): string {
    return formatCurrency(amount);
  }

  protected getDocTipoLabel(tipo: string): string {
    switch (tipo) {
      case '80':
        return 'CUIT';
      case '96':
        return 'DNI';
      default:
        return tipo;
    }
  }

  protected onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }
}
