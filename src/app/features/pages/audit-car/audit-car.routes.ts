import { Routes } from '@angular/router';

export const AUDIT_CAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./audit-car.component').then((m) => m.AuditCarComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/audit-dashboard.component').then(
            (m) => m.AuditDashboardComponent
          ),
      },
      {
        path: 'observations/list',
        loadComponent: () =>
          import('./observation-list/observation-list.component').then(
            (m) => m.ObservationListComponent
          ),
      },
      {
        path: 'observations/create',
        loadComponent: () =>
          import('./create-observation/create-observation.component').then(
            (m) => m.CreateObservationComponent
          ),
      },
      {
        path: 'observations/edit/:id',
        loadComponent: () =>
          import('./create-observation/create-observation.component').then(
            (m) => m.CreateObservationComponent
          ),
      },
      {
        path: 'observations/detail/:id',
        loadComponent: () =>
          import('./observation-detail/observation-detail.component').then(
            (m) => m.ObservationDetailComponent
          ),
      },
      {
        path: 'excel-upload',
        loadComponent: () =>
          import('./excel-upload/excel-upload.component').then(
            (m) => m.ExcelUploadComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
