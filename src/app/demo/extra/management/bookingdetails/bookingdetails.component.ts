import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { Bookingdetails } from './bookingdetails.modal';
import { BookingdetailsService } from './bookingdetails.service';
@Component({
  selector: 'app-bookingdetails',
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
  templateUrl: './bookingdetails.component.html',
  styleUrl: './bookingdetails.component.scss'
})
export default class BookingdetailsComponent implements OnInit {
  logcode: any;
  bookingdata: any;
  parkingarea: any;
  filterlog: any;
  date:any;
  indexdata: any[];
  constructor(public bookingservice: BookingdetailsService, public toaster: ToastrService, public router: Router,
    public spinner:NgxSpinnerService, public datepipe: DatePipe,public modalService: NgbModal) { }

  ngOnInit() {
    this.getBookingdetails();
    this.resetform();
  }
  imgModal(img: ElementRef) {
    this.modalService.open(img, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.bookingservice.bookingdata = {
      customername: "",
      parkinglot: "",
      parkingarea: "",
      bookingid: "",
      bookingdate: "",
      startdate: "",
      bookingstatus: "",
      isactive: "",
      enddate: "",
      duration: "",
      paymentid: "",
      vehid: "",
      vehicleno: "",
      parking_lot_id:"",
      token:""
    }
  }
  getBookingdetails() {
    this.spinner.show();
    this.bookingservice.getBookingDetails().subscribe((Response: Bookingdetails[]) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == "1980") {
        this.parkingarea = Response["Response"][2];
        if(Response["Response"][1].length!=0){
          this.bookingdata = Response["Response"][1];
          this.datatable();
          this.spinner.hide();
          this.date = Response["Response"][1][0]["bookingdate"];
        }else {
          this.toaster.info("So far no booking");
          this.datatable();
          this.spinner.hide();
          this.date= new Date();
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
  getParkingArea(event:any){
     this.bookingservice.bookingdata.parking_lot_id = event.target.value;
  }
  getBookingStatus(event:any){
    this.bookingservice.bookingdata.bookingstatus = event.target.value;
  }
  filterBooking(){
    this.bookingservice.bookingdata.bookingdate =this.datepipe.transform(this.date,'yyyy-MM-dd') ;
    this.bookingservice.getFilteredData().subscribe((Response)=>{
      this.filterlog = Response["Response"][0][0]["_logcode"];
      if(this.filterlog == '1990'){
        if(Response["Response"][1].length !=0){
          this.bookingdata = Response["Response"][1];
        }else{
          this.toaster.warning("No booking available");
          this.bookingdata = [];
        }
        $('#mytable').DataTable().destroy();
        this.datatable();
      }
    });
  }
  datatable(){
    $(document).ready(function () {
      var table = $('#mytable').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  getIndex(i:any){
    this.indexdata = Array(this.bookingdata[i]);
      this.bookingservice.bookingid= this.indexdata[0]["bookingid"];
      localStorage.setItem('bookingid', JSON.stringify(this.bookingservice.bookingid));
  }
}
