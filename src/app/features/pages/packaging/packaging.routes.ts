import { Routes } from '@angular/router';

export const PACKAGING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./packaging.component').then(m => m.PackagingComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./packaging-dashboard/packaging-dashboard.component').then(m => m.PackagingDashboardComponent)
      },
      {
        path: 'upload',
        loadComponent: () => import('./upload-creative/upload-creative.component').then(m => m.UploadCreativeComponent)
      },
      {
        path: 'select-approvers',
        loadComponent: () => import('./select-approvers/select-approvers.component').then(m => m.SelectApproversComponent)
      },
      {
        path: 'inbox',
        loadComponent: () => import('./approval-inbox/approval-inbox.component').then(m => m.ApprovalInboxComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () => import('./approval-detail/approval-detail.component').then(m => m.ApprovalDetailComponent)
      },
      {
        path: 'audit-trail',
        loadComponent: () => import('./audit-trail/audit-trail.component').then(m => m.AuditTrailComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
