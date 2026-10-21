import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'paymentlog',
        loadComponent: () => import('./paymentlog/paymentlog.component')
      },
      {
        path:'refunds',
        loadComponent: () => import('./refunds/refunds.component')
      },
      {
        path:'reconciliation',
        loadComponent: () => import('./reconciliation/reconciliation.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
