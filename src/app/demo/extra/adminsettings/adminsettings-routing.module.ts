import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path:'orgprofile',
        loadComponent: () => import('./orgprofile/orgprofile.component')
      },
      {
        path:'orgtype',
        loadComponent: () => import('./orgtype/orgtype.component')
      },
      {
        path:'role',
        loadComponent: () => import('./role/role.component')
      },
      {
        path:'staff',
        loadComponent: () => import('./staff/staff.component')
      },
      {
        path:'settariff',
        loadComponent: () => import('./settariff/settariff.component')
      },
      {
        path:'viewtariff',
        loadComponent: () => import('./viewtariff/viewtariff.component')
      },
      {
        path:'vehiclecategory',
        loadComponent: () => import('./vehiclecategory/vehiclecategory.component')
      },
      {
        path:'orgfunctionalmap',
        loadComponent: () => import('./orgfunctionalmap/orgfunctionalmap.component')
      },
      {
        path:'orgdomain',
        loadComponent: () => import('./orgdomain/orgdomain.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsettingsRoutingModule { }
