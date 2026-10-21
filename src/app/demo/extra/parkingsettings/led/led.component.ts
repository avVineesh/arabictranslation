import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { Ledconfig } from './led.modal';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { LedconfigService } from './led.service';
@Component({
  selector: 'app-led',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    NgxSpinnerModule,
    NgbDropdownModule
  ],
  templateUrl: './led.component.html',
  styleUrl: './led.component.scss'
})
export default class LedComponent implements OnInit {
  Csv: any = [];
  dtHolidays: any;
  fileReaded: any;
  leddata: any;
  ledindex: any[];
  constructor(public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService, public service:LedconfigService,public modalService: NgbModal) { }

  ngOnInit() {
    this.getLedConfigDetails();
    this.resetform();
    this.dtHolidays = [
      { "DeviceID": '', "MAC Address": '', "Mqtt-Topic": '' }
    ];
  }
  addLed(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  updateLed(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  bulkLed(bulk: ElementRef) {
    this.modalService.open(bulk, { size: 'md' });
  }
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    //showTitle: true,
    useBom: true,
    noDownload: false,
    headers: ["Device-ID", "MAC-Address", "Mqtt-Topic"]
  };
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
      this.service.ledmodal = {
        token: "",
        mac_id: "",
        deviceid: "",
        topic: "",
        createddate: "",
        status: "",
        id: ""
      }
  }
getLedConfigDetails(){
  this.spinner.show();
  this.service.getLedDetails().subscribe((Response)=>{
    console.log(Response);
    let logcode = Response["Response"][0][0]['_logcode'];
    if(logcode=='2980'){
      if(Response["Response"][1].length!=0){
        this.leddata = Response["Response"][1];
        this.datatable();
        this.spinner.hide();
      }else{
        this.toaster.info("No data available!");
        this.spinner.hide();
      }
    }else{
      this.toaster.error("Token Expired");
      localStorage.removeItem("access_token");
      localStorage.removeItem("orgid");
      localStorage.removeItem("Role");
      localStorage.removeItem("privilege");
      this.router.navigate(['login']);
      this.spinner.hide();
    }
  })
}
addNewLed(){ // function for adding individual led details
  this.service.saveLedConfig().subscribe((Response)=>{
    console.log(Response);
    let logcode = Response["Response"][0][0]['_logcode'];
    if(logcode=='2970'){
      this.toaster.success('Saved Successfully:)');
      $('#mytable').DataTable().destroy();
      this.getLedConfigDetails();
    }else if(logcode=='2972'){
      this.toaster.warning('Deviceid already exist!');
    }else{
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
datatable() { // function for coverting in to data table
  $('#mytable').DataTable().destroy();
  $(document).ready(function () {
    var table = $('#mytable').DataTable({
      "ordering": false,
      dom: "Bfrtip"
    });
    table.draw();
  });
}
downloadCSV() {   //Function for Downloading the csv file
  new AngularCsv(this.dtHolidays, "LED Details", this.csvOptions);
}
ledBulkUpload(fileInput: any) {  //Function for uploading led by excel file
  this.fileReaded = fileInput.target.files[0];
  let reader: FileReader = new FileReader();
  reader.readAsText(this.fileReaded);
  reader.onload = (e) => {
    let csv: any = reader.result;
    let allTextLines = csv.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    let lines = [];
    let deviceid = [];
    let macid = [];
    let topic = [];
    for (let i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        let tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
      // log each row to see output 

    }
    this.Csv = lines;
    for (let i = 1; i < this.Csv.length; i++) {
      deviceid.push(this.Csv[i][0]);
      macid.push(this.Csv[i][1]);
      topic.push(this.Csv[i][2]);
    }
    for (let j = 0; j < deviceid.length; j++) {
      this.service.ledmodal.deviceid = deviceid[j];
      this.service.ledmodal.mac_id = macid[j];
      this.service.ledmodal.topic = topic[j];
      this.service.saveLedConfig().subscribe((Response) => {
        var bulklog = Response["Response"][0][0]["_logcode"];
        if (bulklog == '2970') {
          this.toaster.success("LED Details Uploaded Successfully");
          
        }
        else if (bulklog == '2972') {
          this.toaster.warning("Led already exist with the same Device ID,Please try different");
        }
        else if (bulklog == '2971') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
    $('#mytable').DataTable().destroy();
          this.getLedConfigDetails();
  }
}
changeStatus(data:Ledconfig) {
  if (data.status == '1') {
    data.status = '0';
    var isactive = '1'
  }
  else {
    data.status = '1';
    isactive = '2'
  }
  data.token = JSON.parse(localStorage.getItem('access_token'));
  this.service.changeLEDStatus(data).subscribe((Response) => {
    console.log(Response);
    let statuslog = Response["Response"][0][0]["_logcode"];
    if (statuslog == '2990' && isactive == '1') {
      this.toaster.success("LED Deactivated!");
    }
    if (statuslog == '2990' && isactive == '2') {
      this.toaster.success("LED Activated!");
    }
    if (statuslog == '2991') {
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
  this.ledindex = Array(this.leddata[i])
}
editLed(editdata:Ledconfig){
  this.service.updateLedConfig(editdata).subscribe((Response) => {
    var updatelog = Response["Response"][0][0]["_logcode"];
    if (updatelog == '3000') {
      this.toaster.success("Updated successfully");
      this.getLedConfigDetails();
    } else if (updatelog == '3002') {
      this.toaster.warning("Same device id exist, try with different name");
      this.getLedConfigDetails();
      return;
    } else if (updatelog == '3001') {
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
