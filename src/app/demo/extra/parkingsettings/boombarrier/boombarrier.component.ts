import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Boombarrier } from './boombarrier.modal';
import { BoombarrierService } from './boombarrier.service';
@Component({
  selector: 'app-boombarrier',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './boombarrier.component.html',
  styleUrl: './boombarrier.component.scss'
})
export default class BoombarrierComponent implements OnInit {
  logcode: any;
  data: Boombarrier[];
  savelog: any;
  parkingarea: any;
  statuslog: any;
  roleindex: any[];
  viewvalue: number;
  parkSpace: string[] = [];
  parkSpace1: string[] = [];
  boombarrierid: any;
  parkassign: any[];
  constructor(public service: BoombarrierService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService,public modalService: NgbModal) { }
    ngOnInit() {
      this.getBoombarrierDetails();
      this.resetform();
      this.viewvalue = 0;
    }
    addBoom(add: ElementRef) {
      this.modalService.open(add, { size: 'md' });
    }
    editBoom(edit: ElementRef) {
      this.modalService.open(edit, { size: 'md' });
    }
    parkAssign(assign: ElementRef) {
      this.modalService.open(assign, { size: 'md' });
    }
    resetform(form?: NgForm) {
      if (form != null)
        form.resetForm();
      this.service.boombarrierdata = {
        boombarriername: "",
        createddate: "",
        deviceid: "",
        id: "",
        isactive: "",
        parking_lot_name: "",
        password: "",
        token: "",
        parking_lot_id: "",
        macid:"",
        ipaddress:"",
        email:"",
        topic: "",
        name:""
      }
    }
    getBoombarrierDetails() {
      this.spinner.show();
      this.service.getBoombarrierDetails().subscribe((Response) => {
        this.logcode = Response["Response"][0][0]["_logcode"];
        if (this.logcode == "2010") {
          this.data = Response["Response"][1];
          this.datatable();
          this.parkingarea = Response["Response"][2];
          this.spinner.hide();
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
      $('#mytable').DataTable().destroy();
      $(document).ready(function () {
        var table = $('#mytable').DataTable({
          "ordering": false
        });
        table.draw();
      });
    }
    saveNewBoombarrier() {
      this.service.addBoombarrier().subscribe((Response) => {
        console.log(Response);
        this.savelog = Response["Response"][0][0]["_logcode"];
        if (this.savelog == '2020') {
          this.toaster.success("Added successfully");
          $('#mytable').DataTable().destroy();
          this.getBoombarrierDetails();
        } else if (this.savelog == '2022') {
          this.toaster.warning("Device ID already Exist!");
        } else if (this.savelog == '2021') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
      this.resetform();
    }
    changeStatus(data: Boombarrier) {
      if (data.isactive == '1') {
        data.isactive = '0';
        var status = '1'
      }
      else {
        data.isactive = '1';
        status = '2'
      }
      data.token = JSON.parse(localStorage.getItem('access_token'));
      this.service.changeBoombarrierStatus(data).subscribe((Response) => {
        this.statuslog = Response["Response"][0][0]["_logcode"];
        if (this.statuslog == '2030' && status == '1') {
          this.toaster.success("Device Deactivated!");
        }
        if (this.statuslog == '2030' && status == '2') {
          this.toaster.success("Device Activated!");
        }
        if (this.statuslog == '2031') {
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
      this.roleindex = Array(this.data[i]);
      this.boombarrierid = this.roleindex[0]['deviceid'];
      localStorage.setItem('boombarierdata', JSON.stringify(this.roleindex));
    }
    editBoombarrier(editdata: Boombarrier) {
      this.service.updateBoombarrier(editdata).subscribe((Response) => {
        console.log(Response);
        var updatelog = Response["Response"][0][0]["_logcode"];
        if (updatelog == '2040') {
          this.toaster.success("Updated successfully");
          this.getBoombarrierDetails();
        } else if (updatelog == '2042') {
          this.toaster.warning("Same device name exist, try with different name");
          this.getBoombarrierDetails();
          return;
        } else if (updatelog == '2041') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
  
    toggleEditable(event) {
      if (event.target.checked) {
        this.viewvalue = 1;
      } else {
        this.viewvalue = 1;
      }
    }
  
    assignParkSpace(value: any) {  // function for assigning the parking space to the bb
      var itemvalue2 = $('.mycheckbox:checked');
      for (var i = 0; i < itemvalue2.length; i++) {
        this.parkSpace.push(itemvalue2[i]["value"]);
      }
      var itemvalue1 = $('.mycheckbox:not(:checked)');
      for (var i = 0; i < itemvalue1.length; i++) {
        this.parkSpace1.push(itemvalue1[i]["value"]);
      }
      this.service.assignParkingSpace(this.parkSpace, this.boombarrierid, this.parkSpace1).subscribe((Response) => {
        let logcode1 = Response["Response1"]["0"]["0"]["_logcode"]
        if (logcode1 == '2640') {
          this.toaster.success("ParkingSpace Assigned Successfully")
          this.viewvalue = 1
        }
        else {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      }, (erro: HttpErrorResponse) => {
  
        this.toaster.warning("Can't Able to Connect");
      });
    }
  
    getParkingSpace() { // function for getting the assigned parking space and checked
      this.parkSpace = [];
      this.parkSpace1 = [];
      this.parkassign = [];
      this.service.getBBtoParkAssign(this.boombarrierid).subscribe((Response) => {
        this.parkassign = Response["Response"][1];
        this.parkassign.forEach((element, key) => {
          if (element["parkingspaceid"] != "") {
            var elm = document.getElementById(element["parkingspaceid"]) as HTMLInputElement;
            if (elm) { elm.checked = true; }
          }
        });
      });
    }
}
