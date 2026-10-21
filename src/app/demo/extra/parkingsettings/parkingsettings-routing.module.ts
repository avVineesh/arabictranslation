import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'parkingarea',
        loadComponent: () => import('./parkingarea/parkingarea.component')
      },
      {
        path:'parkinglots',
        loadComponent: () => import('./parkinglots/parkinglots.component')
      },
      {
        path:'camera',
        loadComponent: () => import('./camera/camera.component')
      },
      {
        path:'cameraplot',
        loadComponent: () => import('./cameraplot/cameraplot.component')
      },
      {
        path:'boombarrier',
        loadComponent: () => import('./boombarrier/boombarrier.component')
      },
      {
        path:'gates',
        loadComponent: () => import('./gates/gates.component')
      },
      {
        path:'display',
        loadComponent: () => import('./display/display.component')
      },
      {
        path:'led',
        loadComponent: () => import('./led/led.component')
      },
      {
        path:'posdevice',
        loadComponent: () => import('./posdevice/posdevice.component')
      },
      {
        path:'rfreader',
        loadComponent: () => import('./rfreaders/rfreaders.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkingsettingsRoutingModule { }
