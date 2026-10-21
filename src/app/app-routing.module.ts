// angular import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './theme/shared/_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./demo/extra/login/login.component')
  },
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AuthGuard],
    children: [
      
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'prefix'
      },
      {
        path: 'adminsettings',
        loadChildren: () => import('./demo/extra/adminsettings/adminsettings.module').then((m)=>m.AdminsettingsModule)
      },
      {
        path: 'parkingsettings',
        loadChildren: () => import('./demo/extra/parkingsettings/parkingsettings.module').then((m)=>m.ParkingsettingsModule)
      },
      {
        path:'analytics',
        loadChildren: () => import('./demo/extra/analytics/analytics.module').then((m)=>m.AnalyticsModule)
      },
      // {
      //   path: 'sample-page',
      //   loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      // },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./demo/extra/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'landing',
        loadComponent: () =>
          import('./demo/extra/landingpage/landingpage.component').then(m => m.LandingpageComponent),
      },
      {
        path:'finance',
        loadChildren: () => import('./demo/extra/finance/finance.module').then((m)=>m.FinanceModule)
      },
      {
        path:'management',
        loadChildren: () => import('./demo/extra/management/management.module').then((m)=>m.ManagementModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
