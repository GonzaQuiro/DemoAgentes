export interface InvoiceExtractorResponse {
  success: boolean;
  message: string;
  data: InvoiceExtractedData;
}

export interface InvoiceExtractedData {
  CuitEmisor: number | null;
  PtoVta: number | null;
  CbteTipo: number | null;
  CbteNro: number | null;
  CbteFch: string | null;
  ImpTotal: number | null;
  CodAutorizacion: string | null;
  DocNroReceptor: number | null;
}

export interface InvoiceValidationRequest {
  CbteModo: 'CAE' | 'CAI' | 'CAEA';
  CuitEmisor: number;
  PtoVta: number;
  CbteTipo: number;
  CbteNro: number;
  CbteFch: string;
  ImpTotal: number;
  CodAutorizacion: string;
  DocTipoReceptor: number;
  DocNroReceptor: number;
}

export interface InvoiceValidationResponse {
  CmpResp: {
    CbteModo: string;
    CuitEmisor: string;
    PtoVta: string;
    CbteTipo: string;
    CbteNro: string;
    CbteFch: string;
    ImpTotal: string;
    CodAutorizacion: string;
    DocTipoReceptor: string;
    DocNroReceptor: string;
  };
  Resultado: 'A' | 'R' | 'M';
  FchProceso: string;
  Events: {
    Evt: {
      Code: string;
    };
  };
}

export type ValidationResult = 'approved' | 'rejected' | 'pending';

export function getValidationResult(resultado: string): ValidationResult {
  switch (resultado) {
    case 'A':
      return 'approved';
    case 'R':
      return 'rejected';
    default:
      return 'pending';
  }
}

export function formatCuit(cuit: number | string): string {
  const cuitStr = cuit.toString();
  if (cuitStr.length === 11) {
    return `${cuitStr.slice(0, 2)}-${cuitStr.slice(2, 10)}-${cuitStr.slice(10)}`;
  }
  return cuitStr;
}

export function formatDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`;
  }
  if (dateStr.length === 14) {
    return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)} ${dateStr.slice(8, 10)}:${dateStr.slice(10, 12)}:${dateStr.slice(12, 14)}`;
  }
  return dateStr;
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(num);
}
