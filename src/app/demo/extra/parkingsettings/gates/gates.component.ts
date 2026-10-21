import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { Gates } from './gates.modal';
import { GatesService } from './gates.service';
@Component({
  selector: 'app-gates',
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
  templateUrl: './gates.component.html',
  styleUrl: './gates.component.scss'
})
export default class GatesComponent implements OnInit {
  boombarrierdata: any;
  gatedata: any;
  statuslog: any;

  constructor(public gateservice: GatesService, public toastr:ToastrService,public router: Router,
    public spinner: NgxSpinnerService,public modalService: NgbModal) { }

  ngOnInit() {
    this.getGateDetails();
    this.resetform();
  }
  addGate(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.gateservice.gatedata = {
      gateid:"",
      boombarrierid:"",
      type:"",
      createddate:"",
      isactive:"",
      token:"",
      name:""
    }
  }
  getGateDetails() {
    this.boombarrierdata = JSON.parse(localStorage.getItem('boombarierdata'));
    console.log(this.boombarrierdata);
    this.gateservice.boombarrierid = this.boombarrierdata[0]["id"];
    this.gateservice.getGateInfo().subscribe((Response)=>{
      console.log(Response);
      let getlog = Response["Response"][0][0]["_logcode"];
      if(getlog == '2450'){
        this.gatedata = Response["Response"][1];
      }else{
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
    // console.log(this.service.gatedata.boombarrierid);
  }
  saveGateInfo(){ 
    console.log("Reached here");
    this.gateservice.gatedata.boombarrierid = this.boombarrierdata[0]["id"];
    this.gateservice.gatedata.type = this.boombarrierdata[0]["boombarriername"];
    console.log(this.gateservice.gatedata);
    this.gateservice.saveGateData().subscribe((Response)=>{
      console.log(Response);
      let savelog = Response["Response"][0][0]["_logcode"];
      if(savelog == '2440'){
        this.toastr.success("Added Successfully");
        this.getGateDetails();
        this.resetform();
      }else{
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  changeStatus(data:Gates){
    console.log(data);
    if (data.isactive == '1') {
      data.isactive = '0';
      var status = '1'
    }
    else {
      data.isactive = '1';
      status = '2'
    }
    data.token = JSON.parse(localStorage.getItem('access_token'));
    this.gateservice.changeGateStatus(data).subscribe((Response)=>{
      console.log(Response);
      this.statuslog = Response["Response"][0][0]["_logcode"];
      if (this.statuslog == '2460' && status == '1') {
        this.toastr.success("Device Deactivated!");
      }
      if (this.statuslog == '2460' && status == '2') {
        this.toastr.success("Device Activated!");
      }
      if (this.statuslog == '2461') {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });

  }
}
