import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { Display } from './display.modal';
import { DisplayService } from './display.service';
import { ParkingareaService } from '../parkingarea/parkingarea.service';
@Component({
  selector: 'app-display',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule
  ],
  providers:[DatePipe],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss'
})
export default class DisplayComponent implements OnInit {
  data: any;
  parkingarea: any;
  savelog: any;
  statuslog: any;
  indexdatata: any[];
  myDate: any;
  minDate: Date;
  boombarrierlist: any;
  showbblist: number=0;
  constructor(public service:DisplayService, public toaster: ToastrService, public router: Router,public paservice:ParkingareaService,
    public spinner: NgxSpinnerService,public datepipe: DatePipe,public modalService: NgbModal) { }

  ngOnInit() {
    this.getDisplayList();
    this.resetform();
  }
  addDisplay(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  editDisplay(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.displaydata = {
      token: "",
      parking_lot_id: "",
      deviceid: "",
      password: "",
      isactive: "",
      modelname:"",
      warrantyenddate:"",
      warrantystartdate:"",
      displaytype:"",
      boombarrierid:"",
      laneid:"",
      ip:"",
      digit:""
    }
  }
  getDisplayList(){ // function for getting new display details
    this.spinner.show();
    this.service.getDisplayDetails().subscribe((Response)=>{
      let getlog = Response["Response"][0][0]["_logcode"];
      if (getlog=='2510') {
        this.parkingarea = Response["Response"][2];
        if (Response["Response"][1].length!=0) {
          this.data=Response["Response"][1];
          this.datatable();
          this.spinner.hide();
        } else {
          this.toaster.info("Display not available!");
          this.datatable();
          this.spinner.hide();
        }
      } else {
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
  datatable() {
    $('#displaytable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#displaytable').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  saveDisplay(){ // function for adding new display details
    if(this.service.displaydata.displaytype=='message' && this.service.displaydata.boombarrierid==""){
      this.toaster.warning("Please assign a Boombarrier for the Display");
    }else{
      this.service.addDisplayDetails().subscribe((Response)=>{
        console.log(Response);
        this.savelog = Response["Response"][0][0]["_logcode"];
        if (this.savelog == '2520') {
          this.toaster.success("Added successfully");
          $('#displaytable').DataTable().destroy();
          this.getDisplayList();
          this.resetform();
        } else if (this.savelog == '2522') {
          this.toaster.warning("Device ID already Exist!");
        } else if (this.savelog == '2521') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
    
  }
  changeStatus(data:Display) {  // function for changing the display status 
    if (data.isactive == '1') {
      data.isactive = '0';
      var status = '1'
    }
    else {
      data.isactive = '1';
      status = '2'
    }
    data.token = JSON.parse(localStorage.getItem('access_token'));
    this.service.changeDisplayStatus(data).subscribe((Response) => {
      this.statuslog = Response["Response"][0][0]["_logcode"];
      if (this.statuslog == '2530' && status == '1') {
        this.toaster.success("Device Deactivated!");
      }
      if (this.statuslog == '2530' && status == '2') {
        this.toaster.success("Device Activated!");
      }
      if (this.statuslog == '2531') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  getIndex(i:any){
    this.indexdatata = Array(this.data[i]);
    if(this.indexdatata[0]["type"]=='message'){
      this.showbblist = 1;
    }else{
      this.showbblist=0;
    }
     let parkinglotid = this.indexdatata[0]["parking_lot_id"];
     this.paservice.parkingspaceid = parkinglotid;
     this.paservice.boombarrierList().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode == '2050'){
        this.boombarrierlist  = Response["Response"][1];
      }
    });
  }
  editData(editdata:Display){
    if(editdata.displaytype=='message' && editdata.boombarrierid == null){
      this.toaster.warning("Please assign a Boombarrier for the Display");
    }else{
     if(editdata.displaytype!='message'){
       editdata.boombarrierid='';
     }
    this.service.updateDisplay(editdata).subscribe((Response)=>{
      let updatelog = Response["Response"][0][0]["_logcode"];
      if (updatelog == '2540') {
        this.toaster.success("Updated successfully");
        this.getDisplayList();
      } else if (updatelog == '2542') {
        this.toaster.warning("Same device id exist, try with different id");
        this.getDisplayList();
        return;
      } else if (updatelog == '2541') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
    }
    
  }
  dateFormat() {                 // function for disabling past date from the datepicker
    this.myDate = new Date();
   
    this.myDate = this.datepipe.transform(this.myDate,'yyyy-MM-dd');
    this.minDate = new Date(this.myDate);
    
  }
  getBoombarrierList(event:any){
      this.paservice.parkingspaceid= event.target.value;
      this.paservice.boombarrierList().subscribe((Response)=>{
        let logcode = Response["Response"][0][0]["_logcode"];
        if(logcode == '2050'){
          this.boombarrierlist  = Response["Response"][1];
        }
      })
  }
  getDisplayType(event:any){
    if(event.target.value=='message'){
      this.showbblist = 1;
    }else{
      this.showbblist = 0;
    }
  }
}
