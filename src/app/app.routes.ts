import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/index',
    pathMatch: 'full'
  },
  //Auth Routes//
 {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.Auth_routes),
  },
  
  //Features Routes//
  { path: '',   
    loadChildren: () =>
      import('./features/pages/pages.routes').then(m => m.Page_routes),
  },
  { path: 'coming-soon', loadComponent: () => import('./features/pages/pages/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent) },
  { path: 'under-maintenance', loadComponent: () => import('./features/pages/pages/under-maintenance/under-maintenance.component').then(m => m.UnderMaintenanceComponent) },
  { path: 'under-construction', loadComponent: () => import('./features/pages/pages/under-construction/under-construction.component').then(m => m.UnderConstructionComponent) },

  {
    path:"**",
    redirectTo:'/error-404'  ,
    pathMatch:'full'
  }
  




 

]as const;
