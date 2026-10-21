import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'parkingareareport',
        loadComponent: () => import('./parkingareareport/parkingareareport.component')
      },
      {
        path:'vehicleparkedreport',
        loadComponent: () => import('./vehicleparkedreport/vehicleparkedreport.component')
      },
      {
        path:'occupancy',
        loadComponent: () => import('./occupancy/occupancy.component')
      },
      {
        path:'customanalytics',
        loadComponent: () => import('./customanalytics/customanalytics.component')
      },
      {
        path:'summary',
        loadComponent: () => import('./summary/summary.component')
      },
      {
        path:'parkinghistory',
        loadComponent: () => import('./parkinghistory/parkinghistory.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
