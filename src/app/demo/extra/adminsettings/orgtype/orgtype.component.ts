import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { OrgtypeService } from './orgtype.service';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-orgtype',
  standalone: true,
  imports: [CommonModule,     
    FormsModule,
    HttpClientModule,
    NgbCarouselModule,
    SharedModule,
    NgxSpinnerModule
  ],
    
  templateUrl: './orgtype.component.html',
  styleUrl: './orgtype.component.scss'
})
export default class OrgtypeComponent implements OnInit {
  logcode: any;
  orgtypedata: any;
  parenttype: any;
  logcode1: any;
  constructor(public service: OrgtypeService, public router: Router, public toastr: ToastrService,public spinner:NgxSpinnerService,public modalService: NgbModal){}
  ngOnInit() {
    this.onGetOrganizationType();
    this.resetform();
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.OrgModal = {
      token: "",
      orgtype: "",
      parentid: "",
      isendpoint: "",
    }
  }
  openSm(content7: ElementRef) {
    this.modalService.open(content7, { size: 'sm' });
  }
  openLg(content6: ElementRef) {
    this.modalService.open(content6, { size: 'md' });
  }
  onGetOrganizationType() {
    this.spinner.show();
    this.service.GetOrganizationType().subscribe((Response) => {
      console.log(Response);
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == '1810') {
        this.orgtypedata = Response["Response"][1];
        this.spinner.hide();
        this.parenttype = Response["Response"][2];
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
        this.spinner.hide();
      }
    });

  }
  SaveOrgType() {
    if (this.service.OrgModal.isendpoint == "") {
      this.toastr.error("Please Mention whether endpoit or not");
    } else {
      this.service.SaveOrganizationType().subscribe((Response) => {
        this.logcode1 = Response["Response"][0][0]["_logcode"];
        if (this.logcode1 == "1820") {
          this.toastr.success("Saved Successfully");

          this.ngOnInit();
        }
        else if (this.logcode1 == "1822") {
          this.toastr.warning("Root Already Exists");
          this.resetform();
        }
        else if (this.logcode1 == "1823") {
          this.toastr.warning("Name Already Exists");
          this.resetform();
        } else if (this.logcode1 == "1824") {
          this.toastr.warning("End point already exist");
          this.resetform();
        }
        else {
          this.toastr.error("Token Failure");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }

  }
}
