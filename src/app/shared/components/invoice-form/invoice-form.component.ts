import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
  OnInit,
  inject
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceExtractedData, InvoiceValidationRequest } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})
export class InvoiceFormComponent implements OnInit {
  readonly extractedData = input<InvoiceExtractedData | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly submitForm = output<InvoiceValidationRequest>();

  protected form!: FormGroup;

  private readonly fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      const data = this.extractedData();
      if (data) {
        this.patchFormWithExtractedData(data);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      CuitEmisor: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      PtoVta: ['', [Validators.required, Validators.min(1)]],
      CbteTipo: ['', [Validators.required, Validators.min(1)]],
      CbteNro: ['', [Validators.required, Validators.min(1)]],
      CbteFch: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      ImpTotal: ['', [Validators.required, Validators.min(0.01)]],
      CodAutorizacion: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      DocNroReceptor: ['', [Validators.required]]
    });
  }

  private patchFormWithExtractedData(data: InvoiceExtractedData): void {
    this.form.patchValue({
      CuitEmisor: data.CuitEmisor?.toString() ?? '',
      PtoVta: data.PtoVta ?? '',
      CbteTipo: data.CbteTipo ?? '',
      CbteNro: data.CbteNro ?? '',
      CbteFch: data.CbteFch ?? '',
      ImpTotal: data.ImpTotal ?? '',
      CodAutorizacion: data.CodAutorizacion ?? '',
      DocNroReceptor: data.DocNroReceptor?.toString() ?? ''
    });
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const request: InvoiceValidationRequest = {
        CbteModo: 'CAE',
        CuitEmisor: Number(formValue.CuitEmisor),
        PtoVta: Number(formValue.PtoVta),
        CbteTipo: Number(formValue.CbteTipo),
        CbteNro: Number(formValue.CbteNro),
        CbteFch: formValue.CbteFch,
        ImpTotal: Number(formValue.ImpTotal),
        CodAutorizacion: formValue.CodAutorizacion,
        DocTipoReceptor: 80,
        DocNroReceptor: Number(formValue.DocNroReceptor)
      };
      this.submitForm.emit(request);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }
}
