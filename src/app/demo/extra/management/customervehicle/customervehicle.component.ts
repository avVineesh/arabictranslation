import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { GetVehicledetails, OwnershipChangeModal, UpdateOwnVehicle } from './customervihicle.modal';
import { CustomerdetailsService } from '../customerdetails/customerdetails.service';
import { VehiclecategoryService } from '../../adminsettings/vehiclecategory/vehiclecategory.service';
import { VehicledetailsService } from './customervihicle.service';
@Component({
  selector: 'app-customervehicle',
  standalone: true,
  imports: [
    CommonModule,      
      FormsModule,
      HttpClientModule,
      NgxSpinnerModule,
      SharedModule,
      NgbCarouselModule,
      NgbDropdownModule,
      RouterModule
  ],
  templateUrl: './customervehicle.component.html',
  styleUrl: './customervehicle.component.scss'
})
export default class CustomervehicleComponent implements OnInit {
  datas: GetVehicledetails[];
  logcode1: any;
  vehicleindex:GetVehicledetails[];
  logcode: any;
  custdetails: any;
  custvehlogcode: any;
  changeownerlogcode: any;
  count: string;
  vehiclecat: any;
  vehsegment: any;
  statusflag: string;
  showsegment: boolean;
  constructor(public service: VehicledetailsService, public toaster: ToastrService,public router: Router,
    public spinner:NgxSpinnerService,public custservice:CustomerdetailsService, public vehservice: VehiclecategoryService,public modalService: NgbModal) { }

  ngOnInit() {
    this.onGet();
    this.resetform();
    this.getVehCategory();
  }
  addCustomerVeh(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  editModal(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.addvehicle = {
      token: "",
      vehicleno: "",
      vehicletype: "",
      vehmake:"",
      vehmodel:"",
      vehcolor:"",
      isprimary:"",
      isowner:"",
      ownerphone:"",
      custid:""

    }
  }
  GetValueIndex(i:any){
    this.vehicleindex=Array(this.datas[i]);
    console.log(this.vehicleindex[0]['vehicletype']);
    if(this.vehicleindex[0]['vehicletype']=='Car'){
      this.showsegment=true;
    }else{
      this.showsegment = false;
    }
  }
  onGet() {
    this.spinner.show();
    this.custdetails = JSON.parse(localStorage.getItem('custdetails'));
    this.service.custid = this.custdetails[0]["custid"];
    this.service.GetVehicleDetails()
      .subscribe((Response) => {
        this.custvehlogcode = Response["Response"][0][0]["_logcode"];
        if(this.custvehlogcode == '1940' && Response["Response"][1].length!=0){
          this.datas = Response["Response"][1];
          this.datatable();
          this.spinner.hide();
        }else if(this.custvehlogcode == '1940' && Response["Response"][1].length==0){
          this.toaster.warning("No Vehicle Details");
          this.datatable();
          this.spinner.hide();
        }else{
          this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
        this.spinner.hide();
        }
        
      });
      this.resetform();
  }
  changeStatus(vehicledata: GetVehicledetails) {
    if (vehicledata.isdeleted == '1') {
      vehicledata.isdeleted = '0';
      this.statusflag = '1';
    }
    else {
      vehicledata.isdeleted = '1';
      this.statusflag= '0';
    }
    vehicledata.token = JSON.parse(localStorage.getItem('access_token'));

    this.service.ChangeOwnVehicleStatus(vehicledata).subscribe((response) => {
      this.logcode1 = response["Response"][0][0]["_logcode"];
      if (this.logcode1 == '1310' && this.statusflag =='0') {
        this.toaster.success("Vehicle deactivated:)");
      }
      else if (this.logcode1 == '1310' && this.statusflag =='1') {
        this.toaster.success("Vehicle Activated:)");
      }
      else {
        this.toaster.error("Some thing Went Wrong:(");
      }
    });
  }
  onAdd(){
    this.service.addvehicle.custid = this.custdetails[0]["custid"];
    this.service.AddOwnVehicle()
    .subscribe((Response)=>{
      status = Response["Response"][0][0]["_logcode"];
      if(status == '1960') {
        this.toaster.success("Saved to Database");
        this.onGet();
      } 
      else if (status== '1962') {
        this.toaster.warning("Already Exists!");
      }
      else{
        this.toaster.error("Some thing Went Wrong!");
      }
     
    });
 
    this.resetform();
  }
  OnUpdate(vehicledata1:UpdateOwnVehicle){
    this.spinner.show();
    if(vehicledata1.vehicletype!='Car'){
      vehicledata1.segmentid = '';
    }
    this.service.OnUpdateVehicle(vehicledata1).subscribe((Response)=>{
     let updatelog = Response["Response"][0][0]["_logcode"];
     if(updatelog == '2670'){
       this.toaster.success("Updated Successfully.");
       this.onGet();
       this.spinner.hide();
     }else{
      this.toaster.error("Token Expired");
      localStorage.removeItem("access_token");
      localStorage.removeItem("orgid");
      localStorage.removeItem("Role");
      localStorage.removeItem("privilege");
      this.router.navigate(['login']);
      this.spinner.hide();
     }
    });
   }

   // Function for ownership changing
   ownershipChange(data:OwnershipChangeModal){
     if(data.isowner == '1'){
       data.isowner = '0'
       this.count='1';
     }else{
       data.isowner='1';
       this.count='2';
     }
     data.token = JSON.parse(localStorage.getItem('access_token'));
     this.service.changeOwnership(data).subscribe((Response)=>{
          this.changeownerlogcode = Response["Response"][0][0]["_logcode"];
          if(this.changeownerlogcode == '1950'&&this.count=='1' ){
            this.toaster.success("Ownership Deactivated");
          }else if(this.changeownerlogcode=='1950' && this.count=="2"){
            this.toaster.success("Ownership Activated");
          }else if(this.changeownerlogcode=='1952'){
            this.toaster.warning("Vehicle owner Already Exist Please check the User Details");
            this.onGet();
          }
          else{
            this.toaster.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
     });
   }
   getVehCategory(){
     this.vehservice.GetVehicleCateory().subscribe((Response)=>{
       this.vehiclecat = Response["Response"][1];
     });
   }
   getSegment(event:any){
     if(event.target.value == 'Car'){
      this.showsegment= true;
      this.service.vehtype = event.target.value;
      this.service.getVehSegment().subscribe((Response)=>{
        this.vehsegment = Response["Response"][1];
      });
     }else{
       this.showsegment=false;
     }
   }
   segmentForEdit(){
     this.service.vehtype = 'Car';
     this.service.getVehSegment().subscribe((Response)=>{
      this.vehsegment = Response["Response"][1];
    });
   }
    datatable() {
    $('#custvehicles').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#custvehicles').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
}
