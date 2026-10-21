import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OrganizationdomainService } from './orgdomain.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
@Component({
  selector: 'app-orgdomain',
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
  templateUrl: './orgdomain.component.html',
  styleUrl: './orgdomain.component.scss'
})
export default class OrgdomainComponent implements OnInit {
  excelheaders: any;
  Csv: any = [];
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    //showTitle: true,
    useBom: true,
    noDownload: false,
    headers: ["CompanyName", "EmailDomain", "OrganizationDomains", "Slots"]
  };
  orglist: any;
  domaindata: any;
  fileReaded: any;
  indexdata: any[];
  arraylist: any;
  viewlist: number;
  constructor(public datepipe: DatePipe, public toaster: ToastrService, public spinner: NgxSpinnerService, 
    public service:OrganizationdomainService,public router: Router,public modalService: NgbModal) { }
  ngOnInit() {
    this.resetform();
    this.getOrgDomainDetails();
    this.excelheaders = [
      { "CompanyName": '', "EmailDomain": '', "OrganizationDomains": '', "Slots": ''}
    ];
  }
  addDomain(adddomain: ElementRef) {
    this.modalService.open(adddomain, { size: 'md' });
  }
  bulkUpload(bulkupload: ElementRef) {
    this.modalService.open(bulkupload, { size: 'md' });
  }
  editScreen(editscreen: ElementRef) {
    this.modalService.open(editscreen, { size: 'md' });
  }
  domainList(list: ElementRef) {
    this.modalService.open(list, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
      this.service.domainData={
        token :"",
        companyname: "",
        createddate: "",
        emaildomain: "",
        id: "",
        orgdomains: "",
        orgid: "",
        slots: ""
      }
  }
  downloadCSV() { // function for downloading csc ................................................................................
    let date: any = new Date();
    date = this.datepipe.transform(date, 'medium')
    new AngularCsv(this.excelheaders, "Domain_Details " + date, this.csvOptions);
  }
  getOrgDomainDetails(){ // function for getting organization domain details.........................................................
    this.spinner.show();
    this.service.getOrgDomainDetails().subscribe((Response)=>{
      console.log(Response);
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode =='2920'){
        this.orglist = Response["Response"][1];
        if(Response["Response"][2].length!=0){
          this.domaindata = Response["Response"][2];
          this.datatable();
          this.spinner.hide();
        }else{
          this.toaster.info("No Domain Details!");
          this.datatable();
          this.spinner.hide();
        }
      }
    })
  }
  saveOrgDomain(){ // function for saving organization domain details...................................................................
    this.service.saveOrgDomainDetails().subscribe((Response)=>{
      let logcode= Response["Response"][0][0]["_logcode"];
      if(logcode=='2930'){
        this.toaster.success("Saved Successfully")
        this.spinner.hide();
        $('#mytable1').DataTable().destroy();
        this.getOrgDomainDetails();
      }else if(logcode  =='2932'){
        this.toaster.warning('Organization Already Exist!');
      }
      else if(logcode=='2931'){
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
  datatable() {
    $('#mytable1').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable1').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  bulkDomainUpload(fileInput: any){
    this.fileReaded = fileInput.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    reader.onload = (e) => {
      let csv: any = reader.result;
      let allTextLines = csv.split(/\r\n|\n/);
      let headers = allTextLines[0].split(',');
      let lines = [];
      let companyname = [];
      let emaildomain = [];
      let organizationdomains = [];
      let slots = [];
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
        companyname.push(this.Csv[i][0]);
        emaildomain.push(this.Csv[i][1]);
        organizationdomains.push(this.Csv[i][2]);
        slots.push(this.Csv[i][3]);
      }
      for (let i = 0; i < companyname.length; i++) {
        this.service.domainData.companyname = companyname[i];
        this.service.domainData.emaildomain = emaildomain[i];
        this.service.domainData.orgdomains = organizationdomains[i];
        this.service.domainData.slots = slots[i];
        this.service.saveBulkdomainData(this.service.domainData).subscribe((Response) => {
          console.log(Response);
          let bulklog = Response["Response"][0][0]["_logcode"];
          if (bulklog == '2930') {
            this.toaster.success("Domain Details Uploaded Successfully");
            this.ngOnInit();
          }
          else if (bulklog == '2932') {
            this.toaster.warning("Domain Details Already Exist!");
          }
          
          else if (bulklog == '2931') {
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
  }
  getDomainIndex(i:any){
    this.indexdata = Array(this.domaindata[i])
  }
  updateOrgDomainDetails(updatedata:any){
    this.service.updateDomainDetails(updatedata).subscribe((Response)=>{
      let updatelog = Response["Response"][0][0]["_logcode"];
      if (updatelog == '2940') {
        $('#mytable1').DataTable().destroy();
        this.toaster.success("Updated successfully");
        this.getOrgDomainDetails();
      } else if (updatelog == '2942') {
        $('#mytable1').DataTable().destroy();
        this.toaster.warning("Company Name already exist!");
        this.getOrgDomainDetails();
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
  displayOrgDomainsList(i:any){
    let listdata = Array(this.domaindata[i]['orgdomains']);
    if(listdata.length!=0){
      this.viewlist = 0;
      let list = listdata[0];
      this.arraylist = list.split(',');
      console.log(this.arraylist);
    }else{
      this.viewlist = 1;
    }
  }
}
