import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { FastagdetailsService } from './fastagdetails.service';
@Component({
  selector: 'app-fastagdetails',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule
  ],
  templateUrl: './fastagdetails.component.html',
  styleUrl: './fastagdetails.component.scss'
})
export default class FastagdetailsComponent implements OnInit {
  fastagdata: any;
  parkingarea: any;
  date: any;
  indexdata: any;
  imageurl: any;
  showimg: number;
  filelist: any[];
  file: any;
  arrayBuffer: any;
   total: any=0;
  totalentry: number;
  totalexit: number;
  constructor(public service: FastagdetailsService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService,public modalService: NgbModal) { }

  ngOnInit() {
    this.getFastagDetails();
    this.resetform();
  }
  imgModal(img: ElementRef) {
    this.modalService.open(img, { size: 'lg' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.fastagmodal = {
      parkinglotid: "",
      parkingstatus: "",
      fastagstatus: "",
      parkingdate: "",
      token: ""

    },
    this.service.requestdata ={
      ticket_id:[],
      plaza_id:"",
      ref_response_id:[]
    }
  }
  getFastagDetails() {  // function for getting fastag details
    this.totalentry=0;
    this.totalexit=0;
    this.spinner.show();
    this.service.getFastagDetails().subscribe((Response) => {
      let getlogcode = Response["Response"][0][0]["_logcode"];
      if (getlogcode == '2260') {
        this.parkingarea = Response["Response"][2];
        try {
          this.service.parkboxtoken = Response["Response"][3][0]["token"];
        } catch (error) {
          this.toaster.info('Parbox details not addedd!');
          this.spinner.hide();
        }
        //this.service.parkboxtoken = Response["Response"][3][0]["token"];
        if (Response["Response"][1].length != '0') {
          this.fastagdata = Response["Response"][1];
          this.total = Response["Response"][4][0]["total"];
          this.totalentry=Response["Response"][5][0]["totalentry"];
          this.totalexit = Response["Response"][5][0]["totalexit"];
          this.datatable();
          this.spinner.hide();
          this.date = new Date().toLocaleDateString('en-CA');;
        } else {
          this.total=0;
          this.toaster.info("No Fasttag Entry!");
          this.spinner.hide();
          this.date = new Date().toLocaleDateString('en-CA');;
          this.datatable();
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
    this.spinner.show();
    $('#mytable1').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable1').DataTable({
        "ordering": false
      });
      table.draw();
    });
    this.spinner.hide();
  }
  getParkingArea(event: any) { //event for binding the parking area for filter
    this.service.fastagmodal.parkinglotid = event.target.value;
  }
  getParkingStatus(event: any) { //event for binding the parking status for filter
    this.service.fastagmodal.parkingstatus = event.target.value;
  }
  getFastagStatus(event: any) { //event for binding the fastag status for filter
    this.service.fastagmodal.fastagstatus = event.target.value;
  }

  filterFasTagData() { // function for filtering fastag data
    this.totalentry=0;
    this.totalexit=0;
    this.total=0;
    if (this.service.fastagmodal.fastagstatus == "") {
      this.service.fastagmodal.fastagstatus = '2';
    }
    if (this.service.fastagmodal.parkinglotid == "") {
      this.service.fastagmodal.parkinglotid = '0';
    }
    if (this.service.fastagmodal.parkingstatus == "") {
      this.service.fastagmodal.parkingstatus = '2';
    }
    this.service.fastagmodal.parkingdate = this.date;
    this.service.filterFasTagData().subscribe((Response) => {
      let filterlogcode = Response["Response"][0][0]["_logcode"];
      if (filterlogcode == "2270") {
        if (Response["Response"][1].length != 0) {
          this.fastagdata = Response["Response"][1];
           this.total = Response["Response"][2][0]["total"];
           this.totalentry= Response["Response"][3][0]["totalentry"];
           this.totalexit= Response["Response"][3][0]["totalexit"];
        } else {
          this.toaster.warning("No FasTag Entry");
          this.total=0;
          this.fastagdata = [];
        }
        $('#mytable1').DataTable().destroy();
        this.datatable();
      }
    })
  }
  getIndex(i: any) {
    this.indexdata = Array(this.fastagdata[i]);
    this.service.parkinglogid = this.indexdata[0]["parkinglogid"];
  }
  getEntryImage() { // function for showing entry image
    this.service.type = 'Entry';
    this.service.getFastagParkingImg().subscribe((Response) => {
      let entryimglog = Response["Response"][0][0]["_logcode"];
      if (entryimglog == '2320') {
        if (Response["Response"][1].length != 0) {
          this.showimg = 1;
          this.imageurl = JSON.parse(Response["Response"][1][0]["imageurl"]);
        } else {
          this.showimg = 0;
        }

      }
    });
  }
  getExitImage() { // function for showing exit image
    this.service.type = 'Exit';
    this.service.getFastagParkingImg().subscribe((Response) => {
      let entryimglog = Response["Response"][0][0]["_logcode"];
      if (entryimglog == '2320') {
        if (Response["Response"][1].length != 0) {
          this.showimg = 1;
          this.imageurl = JSON.parse(Response["Response"][1][0]["imageurl"]);
        } else {
          this.showimg = 0;
        }

      }
    });
  }

  // addFile(event: any) {
  //   this.file = event.target.files[0];
  //   let fileReader = new FileReader();
  //   fileReader.readAsArrayBuffer(this.file);
  //   fileReader.onload = (e) => {
  //     this.arrayBuffer = fileReader.result;
  //     var data = new Uint8Array(this.arrayBuffer);
  //     var arr = new Array();
  //     for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //     var bstr = arr.join("");
  //     var workbook = XLSX.read(bstr, { type: "binary" });  
  //     var first_sheet_name = workbook.SheetNames[0];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     var arraylist = XLSX.utils.sheet_to_json(worksheet, { blankrows: false });
  //     this.filelist = [];

  //   }
  // }
  // deleteRow(ws, index) {
  //   var variable = XLSX.utils.decode_range(ws["!ref"])
  //   for (var R = index; R < variable.e.r; ++R) {
  //     for (var C = variable.s.c; C <= variable.e.c; ++C) {
  //       ws[this.ec(R, C)] = ws[this.ec(R + 1, C)];
  //     }
  //   }
  //   variable.e.r--
  //   ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
  //   var arraylist = XLSX.utils.sheet_to_json(ws, { blankrows: false });
  //   // console.log(arraylist)
  // }
  // ec(r, c) {
  //   return XLSX.utils.encode_cell({ r: r, c: c });
  // }
}
