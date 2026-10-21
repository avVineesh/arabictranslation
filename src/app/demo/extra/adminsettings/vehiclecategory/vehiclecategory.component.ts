import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbAccordionModule, NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { VehiclecategoryService } from './vehiclecategory.service';
import { Vehicle } from './vehiclecategory.modal';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-vehiclecategory',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    NgxSpinnerModule,
    SharedModule
  ],
  templateUrl: './vehiclecategory.component.html',
  styleUrl: './vehiclecategory.component.scss'
})
export default class VehiclecategoryComponent implements OnInit {
  VehicleList: any;
 constructor(public spinner:NgxSpinnerService,public modalService: NgbModal, public VehService: VehiclecategoryService){}
 ngOnInit() {
  this.onGet();
  this.resetform();
}

resetform(form?: NgForm) {
  if (form!= null)
    form.resetForm();
    this.VehService.VehicleAdd={
      categoryname: "",
      categorydesc: "",
      token: "",
      orgid: ""
    }
  }

onGet(){
  this.spinner.show();
  this.VehService.GetVehicleCateory()
  .subscribe((Response:Vehicle[])=>{
    this.VehicleList=Response["Response"][1];  
    this.spinner.hide();
  });
}

}
