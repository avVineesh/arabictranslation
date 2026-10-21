import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReconciliationService } from './reconciliation.service';
import * as XLSX from 'xlsx'
import { FastagdetailsService } from '../../management/fastagdetails/fastagdetails.service';
@Component({
  selector: 'app-reconciliation',
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
  templateUrl: './reconciliation.component.html',
  styleUrl: './reconciliation.component.scss'
})
export default class ReconciliationComponent implements OnInit {
  @ViewChild('button') button: ElementRef;
  @ViewChild('buttonclose') buttonclose: ElementRef<any>;
  @ViewChild('myInput') myInputVariable: ElementRef;
  @ViewChild('rec') rec!: ElementRef<any>;
  filelist: any[];
  file: any;
  arrayBuffer: any;
  date: Date;
  fastagdata: any;
  parkingarea: any;
  exceldata: Array<any> = [];
  ticketdata: any;
  reconciliationdata: any;
  indexeddata: any[];
  accepteddata: any;
  viewaccept = 0;
  faileddata: any;
  viewfailed = 0;
  filterdata: any;
   isorg: number = 1;
  callfunction = 0;
  successtotal:number=0;
  failedtotal:number=0;
  orgid: any;
  resLength: any;
  filtdate:any;
  filttodate:any;
  orgname: string;
  nameArray: any[]=[];
  orglist: any;
  parkingspacelist: any;
  filteroption:any;
  pinelabscount: number;
  winparkdatacount: any;
  constructor( public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService, public service: ReconciliationService,private datePipe: DatePipe,public modalService: NgbModal, public fastagservice:FastagdetailsService) { }

  ngOnInit() {
   this.filtdate='';
   this.filttodate='';
    this.getReconiliationdata();
    this.resetform();
    this.service.todate = new Date();
    this.service.todate = this.datePipe.transform(this.service.todate, 'yyyy-MM-dd');
     this.nameArray = [];
    this.getParkingspaceList();
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
  }
  startRec(rec: ElementRef) {
    this.modalService.open(rec, { size: 'md' });
  }
  filtData(filt: ElementRef) {
    this.modalService.open(filt, { size: 'md' });
  }
  getSuccess(suc: ElementRef) {
    this.modalService.open(suc, { size: 'lg' });
  }
  getFailed(fl: ElementRef) {
    this.modalService.open(fl, { size: 'lg' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.requestdata = {
      ticket_id: [],
      plaza_id: "",
      ref_response_id: []
    },
      this.service.reconciliationdata = {
       filename:"",
    posid:"",
    paymentmode:"",
    txndate:"",
    txnamount:"",
    status:"",
    billinvoice:"",
    token:"",
    parkingspaceid:"",
    parkinglogid:""
      }
  }

   getOrgList() {
    this.service.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.service.isendpoint = 1;
        this.service.isorg = this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.service.isendpoint = 0;
        this.service.isorg = this.isorg;
      }
      if (logcode == '10000') {
        if (this.resLength != '2') {
          this.orglist = Response["Response"][1];
        }
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
      // if(this.callfunction==1){
      //   this.getUsedCount();

      // }
    });

  }
  selectEvent(event: any) {
    this.callfunction = 1;
    this.service.orgid = event.target.value;
    this.service.id = event.target.value;
    for (var i = 0; i < this.orglist.length; i++) {
      if (this.orglist[i]["id"] == event.target.value) {
        this.nameArray.push(this.orglist[i]);
      }
    }
    this.getOrgList();
  }
  getId(data: any) {
    this.callfunction = 1;
    for (var j = 0; j < this.nameArray.length; j++) {
      if (data == this.nameArray[j]["id"]) {
        this.nameArray = this.nameArray.slice(0, j + 1);
      }
    }
    this.service.orgid = data;
    this.service.id = data;
    this.getOrgList();
    ;
  }
  modalOpenOnStart() {
    setTimeout(() => {

      this.button.nativeElement.click();

    }, 500);
  }
  getPaymentMode(event:any){
    this.service.mode=event.target.value
  }
  addFile(event: any) {  // function for exporting excel file...............................................
    this.file = event.target.files[0];
    this.service.reconciliationdata.filename = this.file["name"];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.exceldata = XLSX.utils.sheet_to_json(worksheet, { blankrows: false, header: 1 });
      const validRows = this.exceldata.filter(
    (row: any[]) => row.some(cell => cell !== null && cell !== undefined && cell !== '')
  );
  this.pinelabscount = validRows.length-1
      this.file = [];
      this.compareBankReport(this.exceldata);
    }

  }
  getFastagDetails() {  // function for gettinh ther fastag entries................
    this.fastagservice.getFastagDetails().subscribe((Response) => {
      let getlogcode = Response["Response"][0][0]["_logcode"];
      if (getlogcode == '2260') {
        this.parkingarea = Response["Response"][2];
        this.service.parkboxtoken = Response["Response"][3][0]["token"];
        if (Response["Response"][1].length != '0') {
          this.fastagdata = Response["Response"][1];
          this.checkParkzappTransaction(this.fastagdata);
          this.spinner.hide();
          this.date = new Date();
        } else {
          this.toaster.info("No Fasttag Entry!");
          this.date = new Date();
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
    $('#mytable1').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable1').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  checkParkzappTransaction(data: any) {  // function for getting parkzap payment status ..............................
    this.spinner.show();
    for (var i = 0; i < data.length; i++) {
      this.service.requestdata.ticket_id.push(String(data[i]["parkinglogid"]));
      this.service.requestdata.plaza_id = String(data[i]["plaza_id"]);
    }
    this.service.callParkzappApi().subscribe((Response) => {
      var parkzapresp = JSON.parse(Response["Response"])
      this.ticketdata = parkzapresp["ticket_data"];
      if(this.ticketdata){
        this.toaster.success("Please upload the Excel file");
          this.startRec(this.rec);
          this.spinner.hide();
      }
    });
   
   
  }
  compareBankReport(data: any) {  //comparing bank report with parkzap.........................................
    this.spinner.show();
    if(this.service.mode!='fastag'){
       for (var i = 1; i <= data.length - 1; i++) {
      
      for (var j = 0; j < this.filterdata.length; j++) {
        if (data[i][28].replace(/^'/, '') == this.filterdata[j]["payid"]) {
          this.service.reconciliationdata.parkinglogid=this.filterdata[j]["id"];
           this.service.reconciliationdata.parkingspaceid=this.filterdata[j]["parkingspaceid"];
          this.service.reconciliationdata.posid = data[i][3];
          this.service.reconciliationdata.paymentmode = data[i][10];
          this.service.reconciliationdata.txndate = data[i][24];
          this.service.reconciliationdata.txnamount = data[i][21];
          this.service.reconciliationdata.status = data[i][26];
          this.service.reconciliationdata.billinvoice = data[i][28].replace(/^'/, '');
          this.service.saveReconciliationData().subscribe((Response) => {
            let reconciliationlog = Response["Response"][0][0]["_logcode"];
            if (reconciliationlog == '2570') {
            
              this.buttonclose.nativeElement.click();
               
             
            } else if(reconciliationlog == '2572') {
              this.toaster.warning("Something Went Wrong!");
               this.buttonclose.nativeElement.click();
                this.getReconiliationdata();
            }
            
          });
        }

      }
    }
    }
    if(this.service.mode=='fastag'){
      for (var i = 1; i <= data.length - 1; i++) {
        for (var j = 0; j < this.ticketdata.length; j++) {
           if (data[i][0].replace(/^'/, '') == this.ticketdata[j]["transaction_id"]) {
           this.service.reconciliationdata.parkinglogid=this.ticketdata[j]["ticket_id"];
           this.service.reconciliationdata.parkingspaceid=this.service.id;
          this.service.reconciliationdata.posid = data[i][1].replace(/^'/, '');;
          this.service.reconciliationdata.paymentmode = 'Fastag';
          this.service.reconciliationdata.txndate = data[i][5];
          this.service.reconciliationdata.txnamount = this.ticketdata[j]["amount"];
          if( data[i][19]=='ACCEPTED'){
            this.service.reconciliationdata.status = 'success';
          }else{
            this.service.reconciliationdata.status = 'failed';
          }
          this.service.reconciliationdata.billinvoice = data[i][0].replace(/^'/, '');
          this.service.saveReconciliationData().subscribe((Response) => {
            let reconciliationlog = Response["Response"][0][0]["_logcode"];
            if (reconciliationlog == '2570') {
            
              this.buttonclose.nativeElement.click();
               
             
            } else if(reconciliationlog == '2572') {
              this.toaster.warning("Something Went Wrong!");
               this.buttonclose.nativeElement.click();
                this.getReconiliationdata();
            }
            
          });
        }
      }
    }
  }
    this.getReconiliationdata();
     this.resetFile();
     
    this.spinner.hide();
      this.toaster.success("File Uploaded Successfully!");
   
   this.toaster.info(
  `Compared ${this.winparkdatacount} with ${this.pinelabscount}`,
  'Info',
  { timeOut: 0, extendedTimeOut: 0, closeButton: true, tapToDismiss: false }
);

  }
  getReconiliationdata() {  //function for getting reconciliation data.........................................
    this.spinner.show();
    this.service.filtdate=this.filtdate;
    this.service.filttodate=this.filttodate;
    this.service.getReconciliationDetails().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2580') {
        if (Response["Response"][1].length != 0) {
          this.reconciliationdata = Response["Response"][1];
          this.datatable();
          this.spinner.hide();
        } else {
          this.toaster.info("No Reconciliation Data Available!");
          this.reconciliationdata=[];
          this.datatable();
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
    })
  }
  getIndexData(i: any) {
    this.indexeddata = Array(this.reconciliationdata[i]);
    this.service.date = this.indexeddata[0]["filename"];
    this.service.reorgid = this.indexeddata[0]["orgid"];
  }
  getAcceptedTransaction() { // function for listing accepted transaction details..........................
    this.successtotal=0
    this.viewaccept=0;
    this.service.getAcceptedFastagTransaction().subscribe((Response) => {
      let acceptedlog = Response["Response"][0][0]["_logcode"];
      if (acceptedlog == '2590') {
        if (Response["Response"][1].length != 0) {
          this.accepteddata = Response["Response"][1];
          this.successtotal=Response["Response"][2][0]['successtotal'];
          this.datatable1();
        } else {
          this.viewaccept = 1;
        }
      }
    });
  }
  datatable1() {
    $('#mytable2').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable2').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  getFailedTransaction() { // function for listing faild transaction details.................................
    this.failedtotal=0;
    this.viewfailed=0;
    this.service.getFailedFastagTransaction().subscribe((Response) => {
      let failedlog = Response["Response"][0][0]["_logcode"];
      if (failedlog == '2600') {
        if (Response["Response"][1].length != 0) {
          this.faileddata = Response["Response"][1];
          this.failedtotal= Response["Response"][2][0]['failedtotal'];
          this.datatable2();
        } else {
          this.viewfailed = 1;
        }
      }
    });
  }
  datatable2() {
    $('#mytable3').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable3').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  resetFile() { // function for resetting the excel file uploader 
    this.myInputVariable.nativeElement.value = "";
  }
  getFromdate(event: any) {
    this.service.fromdate = event.target.value;
  }
  getTodate(event: any) {
    this.service.todate = event.target.value;
  }
  getCustomFastagData() { // function for getting fastag data with in a date............................
    if(this.service.mode==''|| this.service.mode==null){
      this.toaster.warning("Please select the Payment mode!");
    }else{
         this.service.filterReconciliation().subscribe((Response) => {
      let filterlog = Response["Response"][0][0]["_logcode"];
      if (filterlog == '2610') {
        if (Response["Response"][1].length != '0') {
          this.filterdata = Response["Response"][1];
          const datalength = Response["Response"][1].length;
          this.winparkdatacount= datalength
          if(this.service.mode!='fastag'){
             this.toaster.success("Please upload the Excel file");
          this.startRec(this.rec);
          }
          if(this.service.mode=='fastag'){
             this.service.parkboxtoken = Response["Response"][2][0]["token"];
            this.checkParkzappTransaction(this.filterdata)
          }
         
        } else {
          this.toaster.info("No Payment Details available!");
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
   
  }
   getParkingspaceList(){
    this.service.getParkingspacelist().subscribe((Response)=>{
      let logcode=Response["Response"][0][0]["_logcode"];
      if(logcode='1490'){
        this.parkingspacelist=Response["Response"][1];
      }else{
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  }
  parkispaceFilter(event:any){
      this.service.id=event.target.value;
      this.service.isorg=0;
      this.service.isendpoint=1;
      // this.getPaymentLog();
  }
}
