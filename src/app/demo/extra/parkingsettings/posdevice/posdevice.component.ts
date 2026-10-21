import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { PosdevicesService } from './posdevice.service';
import { Posdevice } from './posdevice.modal';
@Component({
  selector: 'app-posdevice',
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
  templateUrl: './posdevice.component.html',
  styleUrl: './posdevice.component.scss'
})
export default class PosdeviceComponent implements OnInit {
  hierarchytype: any;
  organizations: any[];
  list: any[];
  organizationlist: any;
  date:any;
  parkingspacelist: any;
  isorg: number = 1;
  callfunction = 0;
  orgid: any;
  resLength: any;
  orgname: string;
  nameArray: any[]=[];
  orglist: any;
  areaname: any;
  pos: any;
  dataindex: any[];
  constructor(public service: PosdevicesService,public datepipe: DatePipe,public modalService: NgbModal,public toaster: ToastrService,public router: Router,public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.datatable();
    this.nameArray = [];
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
    this.getParkingspaceList();
    this.resetform();
  }
   resetform(form?: NgForm) {
        if (form != null)
          form.resetForm();
        this.service.posdata = {
          token:"",
          serialno:"",
          simno:"",
          id:"",
          createddate:"",
          pid:"",
          isactive:"",
          parking_lot_id:""
        }
      }
  addPos(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
   editData(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  getOrganization(event: any) {
    this.organizations = [];
    this.list = [];
    var name = event.target.value;

    for (let i = 0; i < this.organizationlist.length; i++) {
      if (this.organizationlist[i]["hierarchy_type"] == name) {
        this.organizations.push(this.organizationlist[i]);
        this.list.push(this.organizationlist[i]);
      }

    }
  }
  datatable() {
    $('#mytable1').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable1').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
   getOrgList() {
    this.service.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.service.isendpoint = 1;
        this.service.isorg = this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.service.isendpoint = 0;
        this.service.isorg = this.isorg;
      }
      if (logcode == '10000') {
        if (this.resLength != '2') {
          this.orglist = Response["Response"][1];
        }
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
      
          this.getPosdetails();
    });

  }
  selectEvent(event: any) {
    this.callfunction = 1;
    this.service.orgid = event.target.value;
    this.service.id = event.target.value;
    for (var i = 0; i < this.orglist.length; i++) {
      if (this.orglist[i]["id"] == event.target.value) {
        this.nameArray.push(this.orglist[i]);
      }
    }
    this.getOrgList();
  }
  getId(data: any) {
    this.callfunction = 1;
    for (var j = 0; j < this.nameArray.length; j++) {
      if (data == this.nameArray[j]["id"]) {
        this.nameArray = this.nameArray.slice(0, j + 1);
      }
    }
    this.service.orgid = data;
    this.service.id = data;
    this.getOrgList();
    ;
  }
  getParkingspaceList(){
    this.service.getParkingspace().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
       if (logcode == '1490') {
        this.areaname = Response["Response"][1];
        
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  }
  savePos(){
  this.service.savePos().subscribe((Response)=>{
    let logcode=Response["Response"][0][0]["_logcode"];
    if(logcode=='30'){
          this.toaster.success("Added Successfully");
          this.getPosdetails();
          this.resetform();
        } else if(logcode=='32'){
          this.toaster.warning("Serial Number already exist")
        }else{
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
  })
  }
  getPosdetails(){
    this.service.getPOSDetails().subscribe((Response)=>{
    let logcode=Response["Response"][0][0]["_logcode"];
        let length = Response["Response"][1].length
        if(logcode=='30')
        {
          if(length!=0){
            this.pos=Response["Response"][1];
            this.datatable();
            this.spinner.hide();
          }else{
            this.toaster.info("No Items Added");
            this.pos=[];
            this.datatable();
            this.spinner.hide();
          }
        }else{
          this.spinner.hide();
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
    })
  }

  changeStatus(data: Posdevice) {
      if (data.isactive == '1') {
        data.isactive = '0';
        var status = '1'
      }
      else {
        data.isactive = '1';
        status = '2'
      }
      data.token = JSON.parse(localStorage.getItem('access_token'));
      this.service.changePOsStatus(data).subscribe((Response) => {
        var statuslog = Response["Response"][0][0]["_logcode"];
        if (statuslog == '60' && status == '1') {
          this.toaster.info("Device Deactivated!");
        }
        if (statuslog == '60' && status == '2') {
          this.toaster.success("Device Activated!");
        }
        if (statuslog == '61') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }

     getIndex(i: any) {
    this.dataindex = Array(this.pos[i]);
  
  }
   editPOSdetails(editdata: Posdevice) {
      this.service.updatePOS(editdata).subscribe((Response) => {
        
        var updatelog = Response["Response"][0][0]["_logcode"];
        if (updatelog == '80') {
          this.toaster.success("Updated successfully");
          this.getPosdetails();
        }
          else if(updatelog== '82'){
            this.toaster.warning("Serialno already exist!");
          
        } else if (updatelog == '81') {
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
