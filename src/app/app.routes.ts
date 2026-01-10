import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'validacion-comprobantes',
        pathMatch: 'full'
      },
      {
        path: 'validacion-comprobantes',
        loadComponent: () =>
          import('./features/invoice-validation/invoice-validation.component').then(
            (m) => m.InvoiceValidationComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'validacion-comprobantes'
  }
];
