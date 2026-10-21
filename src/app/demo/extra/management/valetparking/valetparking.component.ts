import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ValetdetailsService } from './valetparking.service';
@Component({
  selector: 'app-valetparking',
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
  templateUrl: './valetparking.component.html',
  styleUrl: './valetparking.component.scss'
})
export default class ValetparkingComponent implements OnInit{
  date: Date;
  valetdata: any;
  constructor( 
    public toaster: ToastrService, public router: Router,
    public datepipe:DatePipe, public service: ValetdetailsService,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getValetParkingDetails();
  }
getValetParkingDetails(){
  this.spinner.show();
this.service.getValetDetails().subscribe((Response)=>{
  let getlogcode = Response["Response"][0][0]["_logcode"];
  if (getlogcode == '2650') {
    if (Response["Response"][1].length != '0') {
      this.valetdata = Response["Response"][1];
      this.DataTable();
      this.spinner.hide();
      this.date = new Date();
    } else {
      this.toaster.info("No Valet Parking!");
      this.spinner.hide();
      this.date = new Date();
      this.DataTable();
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
DataTable() { // function for creating  datatable 
  $('#mytable').DataTable().destroy();
  $(document).ready(function () {
    var table = $('#mytable').DataTable({
      dom: "Bfrtip"
    });
    table.draw();

  });
}
filterValetDetails(){
  this.spinner.show();
  this.service.date = this.date;
  this.service.filterValetDetails().subscribe((Response)=>{
    let filterlogcode = Response["Response"][0][0]["_logcode"];
    if (filterlogcode == "2660") {
      if (Response["Response"][1].length != 0) {
        this.valetdata = Response["Response"][1];
      } else {
        this.toaster.warning("No Valet Entry");
        this.valetdata = [];
      }
      $('#mytable').DataTable().destroy();
      this.DataTable();
      this.spinner.hide();
    }
  });
}
}
