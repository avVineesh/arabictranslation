import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'passdetails',
        loadComponent: () => import('./monthlypass/monthlypass.component')
      },
      {
        path:'whitelistedvehicles',
        loadComponent: () => import('./customerdetails/customerdetails.component')
      },
      {
        path:'customervehicle',
        loadComponent : () => import('./customervehicle/customervehicle.component')
      },
      {
        path:'bookingdetails',
        loadComponent: () => import('./bookingdetails/bookingdetails.component')
      },
      {
        path:'vehicleblacklisting',
        loadComponent: () => import('./vehicleblacklisting/vehicleblacklisting.component')
      },
      {
        path:'fastagdetails',
        loadComponent: () => import('./fastagdetails/fastagdetails.component')
      },
      {
        path:'networkmonitoring',
        loadComponent: () => import('./networkmonitoring/networkmonitoring.component')
      },
      {
        path:'valetparking',
        loadComponent: () => import('./valetparking/valetparking.component')
      },
      {
        path:'rftagdetails',
        loadComponent: () => import('./rftagdetails/rftagdetails.component')
      },
      {
        path:'assets',
        loadComponent: () => import('./assets/assets.component')
      },
      {
          path:'assetsmapview',
          loadComponent: () => import('./assetsmapview/assetsmapview.component')
      },
      {
        path:'attendanceregister',
        loadComponent: () => import('./attendanceregister/attendanceregister.component')
      }
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
