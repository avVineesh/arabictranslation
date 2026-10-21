import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RefundsService } from './refunds.service';
@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule
  ],
  templateUrl: './refunds.component.html',
  styleUrl: './refunds.component.scss'
})
export default class RefundsComponent {
  refunddata: any;
  date: any;
  parkingarea: any;
  constructor(public refundservice: RefundsService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getRefundData();
  }
  getRefundData() {  // function for getting refund details
    this.spinner.show();
    this.refundservice.getRefundDetails().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"]
      if (logcode == '2210') {
        this.date = new Date();
        this.parkingarea = Response["Response"][2];
        if (Response["Response"][1].length != 0) {
          this.refunddata = Response["Response"][1];
          console.log(this.refunddata);
          this.spinner.hide();
          this.datatable();
        } else {
          this.toaster.info("No Refund Today!");
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
  datatable() { //function for datatable convertion
    $(document).ready(function () {
      var table = $('#mytable').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  getParkingArea(event: any) {
    this.refundservice.parkingspaceid = event.target.value;
  }
  getStatus(event: any) {
    this.refundservice.status = event.target.value;
  }
  filterRefundData() {
    this.refundservice.getFiltereddata().subscribe((Response) => {
      let filterlogcode = Response["Response"][0][0]["_logcode"];
      if (filterlogcode == '2220') {
        if (Response["Response"][1].length != 0) {
          this.refunddata = Response["Response"][1];
        } else {
          this.toaster.info("No Refund Request");
          this.refunddata = [];
        }
        $('#mytable').DataTable().destroy();
        this.datatable();
      }
      else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  }
  changePayStausForUpi(data: any) {
    this.refundservice.refundid = data["id"];
    this.refundservice.changeRefundStatus().subscribe((Response) => {
      let statuslog = Response["Response"][0][0]["_logcode"];
      if (statuslog == '2230') {
        this.toaster.success("Amount Refunded");
        $('#mytable').DataTable().destroy();
        this.getRefundData();
      } else {
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
