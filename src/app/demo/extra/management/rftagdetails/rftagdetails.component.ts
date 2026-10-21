import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { Employeetag } from './rftagdetails.modal';
import { EmployeetagService } from './rftagdetails.service';
@Component({
  selector: 'app-rftagdetails',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbDropdownModule,
    SharedModule
  ],
  providers:[DatePipe],
  templateUrl: './rftagdetails.component.html',
  styleUrl: './rftagdetails.component.scss'
})
export default class RftagdetailsComponent implements OnInit {
  dtHolidays: any;
  rfdata: any;
  tagstatusflag: any;
  fileReaded: any;
  Csv: any = [];
  excelheaders: any;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    //showTitle: true,
    useBom: true,
    noDownload: false,
    headers: ["tagnumber", "epc"]
  };
  constructor(public service: EmployeetagService,public spinner: NgxSpinnerService,public toaster: ToastrService,public router: Router, public datepipe: DatePipe, public modalService: NgbModal) { }

  ngOnInit() {
    this.getRFTagDetails();
    this.resetform();
    this.excelheaders = [
      { "tagnumber": '', "epcid": ''}
    ];
  }
  addTags(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  bulkUpload(bulk: ElementRef) {
    this.modalService.open(bulk, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
   this.service.rfTagData={
     token : "",
     empid: "",
     tagnumber: "",
     status: "",
     usermapid: "",
     date: "",
     epcid: ""
   }
    
  }
  getRFTagDetails(){
    this.spinner.show();
    this.service.getRFtagDetails().subscribe((Response)=>{
      console.log(Response);
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode=='2890'){
        if(Response["Response"][1].length!=0){
          this.rfdata = Response["Response"][1];
          this.datatable();
          this.spinner.hide();
        }else {
          this.toaster.info("No RF Tag Details!");
          this.spinner.hide();
          this.datatable();
        }
      } else{
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
  datatable() {
    $('#mytable1').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable1').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
 changeTagStatus(data:Employeetag){
  if (data.status == '1') {
    data.status = '0';
    this.tagstatusflag = '1';
  }
  else {
    data.status = '1';
    this.tagstatusflag = '0';
  }
  console.log(data);
  this.service.changeTagStatus(data).subscribe((Response)=>{
    console.log(Response);
    let statuslog = Response["Response"][0][0]["_logcode"];
      if (statuslog == '2900' && this.tagstatusflag == '1') {
        this.toaster.success("Tag deactivated!");
      } else if (statuslog == '2900' && this.tagstatusflag == '0') {
        this.toaster.success("Tag activated!");
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
  //Function for downloading csv file 
  downloadCSV() {
    let date: any = new Date();
    date = this.datepipe.transform(date, 'medium')
    new AngularCsv(this.excelheaders, "Employee_Details " + date, this.csvOptions);
  }

 employeeTagBulkUpload(fileInput: any) {
  this.fileReaded = fileInput.target.files[0];
  let reader: FileReader = new FileReader();
  reader.readAsText(this.fileReaded);
  reader.onload = (e) => {
    let csv: any = reader.result;
    let allTextLines = csv.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    let lines = [];
    let tagnumber = [];
    let epcid = [];
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
      tagnumber.push(this.Csv[i][0]);
      epcid.push(this.Csv[i][1]);
     
    }
    for (let i = 0; i < epcid.length; i++) {
      this.service.rfTagData.tagnumber = tagnumber[i];
      this.service.rfTagData.epcid = epcid[i];
      this.service.saveRFTagDetails(this.service.rfTagData).subscribe((Response)=>{
        console.log(Response);
        let logcode = Response["Response"][0][0]["_logcode"];
          if (logcode == '2950') {
            this.toaster.success("Saved Successfully");
          } else if (logcode == '2952') {
            this.toaster.warning("EPC_ID already exist");
          } 
         else if (logcode == '2953') {
          this.toaster.warning("Tag Number already exist");
        }
          else {
            this.toaster.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
      });
    }
    this.getRFTagDetails();
  }
}


saveRFtagData(){ //fnction for savin individual tag deetails .....................................
  this.service.saveRFTagDetails(this.service.rfTagData).subscribe((Response)=>{
    console.log(Response);
    let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2950') {
        this.toaster.success("Saved Successfully");
        this.resetform();
        this.getRFTagDetails();
      } else if (logcode == '2952') {
        this.toaster.warning("EPC_ID already exist");
      } 
     else if (logcode == '2953') {
      this.toaster.warning("Tag Number already exist");
    }
      else {
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
