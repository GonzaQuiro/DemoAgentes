import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InvoiceExtractorResponse,
  InvoiceValidationRequest,
  InvoiceValidationResponse
} from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  extractInvoice(file: File): Observable<InvoiceExtractorResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    return this.http.post<InvoiceExtractorResponse>(
      `${this.baseUrl}/api/v1/text-extractor/invoice_extractor`,
      formData
    );
  }

  validateInvoice(request: InvoiceValidationRequest): Observable<InvoiceValidationResponse> {
    return this.http.post<InvoiceValidationResponse>(
      `${this.baseUrl}/api/v1/validations/arca`,
      request
    );
  }
}
