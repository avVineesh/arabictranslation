import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbAccordionModule, NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { OccupancyService } from './occupancy.service';

import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons-dt';
// import 'pdfmake';
// import 'jszip';
declare var $: any;
@Component({
  selector: 'app-occupancy',
  standalone: true,
  imports: [
    CommonModule,
      NgbCarouselModule,
      FormsModule,
      HttpClientModule,
      NgbAccordionModule,
      NgxSpinnerModule,
      SharedModule
  ],
  templateUrl: './occupancy.component.html',
  styleUrl: './occupancy.component.scss'
})
export default class OccupancyComponent {
  parkedvehicles: any;
  clearlist: Array<any> = [];
  fastaglist: Array<any> = [];
  date: any;
  indexdata: any[];
  imageurl: any;
  showimg: number;
  notificationlist: any;
  isorg: number=1;
  callfunction = 0;
  orgid: any;
  orgArray: any[] = [];
  orglist: any;
  nameArray: any[]=[];
  orgname: any;
  resLength: any;
  todate:any;
  dateControl = new FormControl('');
  parkingspacelist: any;
  filteroption:any;
  totalbalamount:any;
  activeTab: string="Parked";
  balancedata: any;
  cleareddata: any;
  totalcount: number;
  constructor(public service: OccupancyService, public toaster: ToastrService,
    public spinner: NgxSpinnerService, public router: Router,public modalService: NgbModal) { }
    setActiveTab(tab: string) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.loadDataByTab();
  }
  ngOnInit() {
    this.totalbalamount=0;
    this.totalcount = 0;
    this.nameArray=[];
    this.service.orgid =JSON.parse(localStorage.getItem('orgid')) ;
    this.service.id=JSON.parse(localStorage.getItem('orgid')) ;
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.getParkingspaceList()
    this.service.isorg=1;
    this.orgname= localStorage.getItem('orgname') ;
    this.service.date='0';
    this.dateControl.setValue('');
   this.getOrgList();
   this.callfunction=0;
   
    this.resetform();
  }
  entryImage(img: ElementRef) {
    this.modalService.open(img, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.clearModal = {
      transactionid: "",
      amount: 0,
      token: ""

    }
  }

  selectEvent(event:any){ 
    this.callfunction=1;
    this.service.orgid=event.target.value;
    this.service.id=event.target.value;
    for(var i=0;i<this.orglist.length;i++){
      if(this.orglist[i]["id"]==event.target.value){
        this.nameArray.push(this.orglist[i]);
      }
    }
   this.getOrgList();
  }
  getId(data:any){
    this.callfunction=1;
    for(var j=0;j<this.nameArray.length;j++){
      if(data==this.nameArray[j]["id"]){
        this.nameArray= this.nameArray.slice(0,j+1);
      }
    }
    this.service.orgid=data;
    this.service.id=data;
    this.getOrgList();
   ;
  }
  getOrgList(){  
    this.service.getOrgList().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
     this.resLength = Response["Response"].length
     if(this.resLength!='2'){
      this.isorg=1;
     this.service.isorg=this.isorg;
     }
     if(this.resLength=='2'){
      this.isorg=0;
      this.service.isorg=this.isorg;
     }
      if(logcode=='10000'){
        if(this.resLength!='2'){
           this.orglist = Response["Response"][1];
        }
      }else{
        //this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
      // if(this.callfunction==1){
      //   this.getUsedCount();

      // }
       this.loadDataByTab();
    });
   
  }

  getParkedVehicles() {
     $('#mytable1').DataTable().destroy();
    this.parkedvehicles=[];
    this.notificationlist=[];
    this.totalbalamount=0;
    this.totalcount = 0;
    if (this.service.date == undefined || this.service.date == '') {
      this.service.date = '0';
     } 
      if (this.service.todate == undefined || this.service.todate == '') {
      this.service.todate = '0';
     } 
    this.spinner.show();
    this.service.getParkedVehicles().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2710') {
        if (Response["Response"][1].length != '0') {
          this.parkedvehicles = Response["Response"][1];
          this.notificationlist = Response["Response"][2];
          for(var i =0;i<this.parkedvehicles.length;i++){
            for(var j=0;j<this.notificationlist.length;j++){
              if(this.parkedvehicles[i]['parkingid']==this.notificationlist[j]['action'] &&this.parkedvehicles[i]["type"]=='1'){
                this.parkedvehicles[i]['notificationstatus']=1;
              }
            }
          }
          this.DataTable();
          this.spinner.hide();
          this.date = '';
        } else {
          this.toaster.info("No Parked Vehicles");
          this.parkedvehicles=[];
          this.DataTable();
          this.spinner.hide();
          this.date = '';
          this.totalbalamount=0;
          this.totalcount = 0;
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
 getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

DataTable() { // function for creating  datatable 
    $('#mytable1').DataTable().destroy();

  const currentDateTime = this.getCurrentDateTime();
  const totalamount = this.totalbalamount;
  const from = this.date;
  const to = this.todate;
  $(document).ready(function () {
    var table = $('#mytable1').DataTable({
      dom: "Bfrtip",
      buttons: [
        {
          extend: 'pdfHtml5',
          text: 'PDF',
          title: 'Parked Vehicles',
          messageTop: `Report generated Date & Time: ${currentDateTime}, 
                       Filtered From:${from} To: ${to},  
                       Total Balance Amount: ${totalamount}`,
          customize: (doc: any) => {
            // Set page layout
            doc.pageOrientation = 'landscape';
            doc.pageSize = 'A3';
            doc.pageMargins = [10, 60, 10, 30];

            // Watermark
            doc.watermark = {
              text: 'ELVICTO TECHNOLOGIES',
              color: 'blue',
              opacity: 0.08,
              bold: true,
              italics: false,
              fontSize: 40
            };

            // Header
            doc['header'] = {
              columns: [
                {
                  text: 'Parked Vehicles',
                  alignment: 'left',
                  fontSize: 16,
                  bold: true,
                  margin: [20, 10, 0, 0]
                },
                {
                  text: `Report generated: ${currentDateTime}`,
                  alignment: 'right',
                  fontSize: 10,
                  margin: [0, 10, 20, 0]
                }
              ]
            };

            // Footer
            doc['footer'] = function (currentPage, pageCount) {
              return {
                columns: [
                  {
                    text: `Page ${currentPage} of ${pageCount}`,
                    alignment: 'center',
                    fontSize: 9
                  }
                ],
                margin: [0, 0, 0, 10]
              };
            };

            // ✅ Safely find and resize table
   const tableNode = doc.content.find((c: any) => c.table);

if (tableNode && tableNode.table && tableNode.table.body) {

  const colCount = tableNode.table.body[0].length;

  // Keep first column auto, adjust others
  tableNode.table.widths = ['auto', ...Array(colCount - 1).fill('*')];

  tableNode.table.body.forEach((row: any) => {
    row.forEach((cell: any, i: number) => {

      // Skip first column
      if (i === 0) return;

      row[i] = {
        text: typeof cell === 'object' ? cell.text : cell,
        alignment: 'center',
        noWrap: false
      };

    });
  });
}

            // Style adjustments
            doc.defaultStyle.fontSize = 7;
            doc.styles.tableHeader.fontSize = 8;
            doc.styles.tableHeader.bold = true;
            doc.styles.tableHeader.alignment = 'center';
            doc.styles.tableBodyEven.alignment = 'center';
            doc.styles.tableBodyOdd.alignment = 'center';
            doc.content.forEach((item: any) => {
              if (item.table) item.layout = 'lightHorizontalLines';
            });
          },
         exportOptions: {
  columns: ':visible'
}
        },
        {
          extend: 'excel',
          text: 'EXCEL',
          title: 'Parked Vehicles',
          messageTop: `Report generated Date & Time: ${currentDateTime}, 
                       Filtered From:${from} To: ${to}, 
                       Total Balance Amount: ${totalamount}` ,
          exportOptions: {
  columns: ':visible'
}
        }
      ]
    });

    table.draw();
  });
  }
  checkUncheckAll(event: any) { // function for checking and unchecking all transactions
    this.clearlist = [];
    this.fastaglist = [];
    if (this.parkedvehicles.every(val => val.checked == true))
      this.parkedvehicles.forEach(val => { val.checked = false, this.clearlist = [], this.fastaglist = [] });
    else
      this.parkedvehicles.forEach(val => { val.checked = true
        if(val.type =='1'){
          this.fastaglist.push(val.id)
        }
         this.clearlist.push(val.id) });
  }
  checkIndividual(event: any) {  // for clearing from our own db ....................................
    if (!event.target.checked && this.clearlist.length != 0) {
      for (var i = 0; i < this.clearlist.length; i++) {
        if (this.clearlist[i] == event.target.value) {
          this.clearlist.splice(i, 1);
        }
      }
    }
    if (event.target.checked && this.clearlist.length != 0) {
      this.clearlist.push(event.target.value);
    }
    if (event.target.checked && this.clearlist.length == 0) {
      this.clearlist.push(event.target.value);
    }
  }
  checkFatagCheck(event: any){ // for filtering fastag entry for parkzap manual payment call..............................
    this.parkedvehicles.forEach(val => {  
      if(val.id == event.target.value && val.type=='1'){
        if(!event.target.checked && this.fastaglist.length!=0){
          for (var i = 0; i < this.fastaglist.length; i++) {
            if (this.fastaglist[i] == event.target.value) {
              this.fastaglist.splice(i, 1);
            }
          }
        }
        if (event.target.checked && this.fastaglist.length != 0) {
          this.fastaglist.push(event.target.value);
        }
        if (event.target.checked && this.fastaglist.length == 0) {
          this.fastaglist.push(event.target.value);
        }
      }
     });
  }
  getDate(event: any) {
    this.service.date = event.target.value;
  }
  gettoDate(event: any) {
    this.service.todate = event.target.value;
  }
  filterParkedVehicles() { // filter for getting parked vehicles on date.............................................................
    this.spinner.show();
    if(this.service.type==''||this.service.type== undefined){
      this.service.type='2'
    }if(this.service.isvalid=='' ||this.service.isvalid == undefined){
      this.service.isvalid='2'
    }
    if (this.service.date == undefined || this.service.date == '') {
     this.service.date = '0';
    } 
    if(this.service.type=='0' && this.service.isvalid=='0'){
      this.toaster.info('No Parked Vehicles!');
      this.spinner.hide();
            this.parkedvehicles = [];
            $('#mytable1').DataTable().destroy();
            this.DataTable();
    }else{
      this.service.filterParkedVehicles().subscribe((Response) => {
        let logcode = Response["Response"][0][0]["_logcode"];
        if (logcode == '2730') {
          if (Response["Response"][1].length != '0') {
            this.parkedvehicles = Response["Response"][1];
            for(var i =0;i<this.parkedvehicles.length;i++){
              for(var j=0;j<this.notificationlist.length;j++){
                if(this.parkedvehicles[i]['parkingid']==this.notificationlist[j]['action'] &&this.parkedvehicles[i]["type"]=='1'){
                  this.parkedvehicles[i]['notificationstatus']=1;
                }
              }
            }
            this.spinner.hide();
          } else {
            this.toaster.info("No Parked Vehicles");
            this.spinner.hide();
            this.parkedvehicles = [];
          }
          $('#mytable1').DataTable().destroy();
          this.DataTable();
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
   clearParking = () =>{
    this.spinner.show();
    if (this.clearlist.length != 0) {
      var interval = 3000; // how much time should the delay between two iterations be (in milliseconds)?
        for (var j = 0; j < this.clearlist.length; j++) {
          this.service.id="";
          this.service.id = this.clearlist[j];
          this.service.clearParking().subscribe((Response) => {
            let clearlog = Response["Response"][0][0]["_logcode"];
            if (clearlog == '2720') {
              this.toaster.success("Cleared Successfully");
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
        this.clearlist=[];
        this.spinner.hide();
    } else {
      this.toaster.info("Please Select entries for clearing!");
    }
    this.service.date = '';
    this.date = new Date();
    $('#mytable1').DataTable().destroy();
    let elm =  document.getElementById("checkall") as HTMLInputElement;
    elm.checked =false;
    this.ngOnInit();
  }
  // callManualPayment(){ // api call for making manual payment call for parkzappapi fastag list...........................................
  //   for(var k=0; k<this.fastaglist.length;k++){
  //       this.service.clearModal.transactionid = this.fastaglist[k];

  //       this.service.callManualpayment().subscribe((Response1) => {
  //             });
  //   }
  // }
  getIndex(i:any){
    this.indexdata = Array(this.parkedvehicles[i]);
    this.service.parkinglogid = this.indexdata[0]["id"];
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
  getEntryType(event:any){
    this.service.type = event.target.value;
  }
  getFastagStatus(event:any){
    this.service.isvalid = event.target.value;
  }
   getParkingspaceList(){
    this.service.GetParkingAreaList().subscribe((Response)=>{
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
    this.spinner.show();
    this.balancedata=[];
    this.totalbalamount=0;
    this.totalcount = 0;
      this.service.id=event.target.value;
      this.service.isorg=0;
      this.service.isendpoint=1;
    this.parkedvehicles=[];
    if (this.activeTab === 'Parked') {
      this.getParkedVehicles();
    } else if (this.activeTab === 'Balance') {
    this.callCheckBalance();
    } else if(this.activeTab=== 'Clear'){
    this.getclearManual();
    }
  }
  
  loadDataByTab() {
    this.parkedvehicles=[];
    this.balancedata=[];
    if (this.activeTab === 'Parked') {
      if(this.service.id==''){
        this.ngOnInit();
      }else{
          this.getParkedVehicles();
      }
      
    } else if (this.activeTab === 'Balance') {
      this.totalbalamount=0;
      this.totalcount = 0
     this.toaster.info("Plaease select a parking space for showing Balance amount to be collected!");
       this.filteroption = null;
       this.service.id="";
      this.parkedvehicles=[];
      this.DataTable();
    } 
    else if (this.activeTab === 'Clear'){
      this.totalbalamount=0;
      this.totalcount = 0
       this.toaster.info("Plaease select a parking space for showing manually Cleared Vehicles!");
       this.filteroption = null;
       this.service.id="";
      this.parkedvehicles=[];
      this.balancedata=[];
      this.cleareddata=[];
      this.DataTable();
    }
  }

  callCheckBalance(){
    this.spinner.show();
     this.service.Calcbalance().subscribe((Response)=>{
       let logcode = Response["Response"][0][0]["_logcode"];
       if(logcode=='10000'){
        if(Response["Response"][2].length!=0){
          this.balancedata = Response["Response"][2];
          this.totalcount = Response["Response"][3][0]["totalcount"];
         for (let k = 0; k < this.balancedata.length; k++) {
  let amount = Number(this.balancedata[k]["calculatedbalanceamount"]) || 0;
  this.totalbalamount += amount;
}
          this.DataTable();
        }else{
          this.toaster.info("No Parked Vehicles!");
          this.balancedata=[];
          this.totalbalamount=0;
          this.totalcount = 0;
        }
       }else{
         this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
       }
      })
      this.parkedvehicles=[];
      this.DataTable();
      this.spinner.hide();
  }

  getclearManual(){
    this.spinner.show();
     this.service.manualClearVeh().subscribe((Response)=>{
       let logcode = Response["Response"][0][0]["_logcode"];
       if(logcode=='20000'){
        if(Response["Response"][2].length!=0){
          this.cleareddata = Response["Response"][2];
           this.totalcount = Response["Response"][3][0]["totalcount"];
         for (let k = 0; k < this.cleareddata.length; k++) {
  let amount = Number(this.cleareddata[k]["calculatedbalanceamount"]) || 0;
  this.totalbalamount += amount;
}
          this.DataTable();
        }else{
          this.toaster.info("No Parked Vehicles!");
          this.cleareddata=[];
          this.totalbalamount=0;
          this.totalcount = 0;
        }
       }else{
         this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
       }
      })
      this.parkedvehicles=[];
      this.DataTable();
      this.spinner.hide();
  }

  loadFilter(){
     this.parkedvehicles=[];
    this.balancedata=[];
    this.totalbalamount=0;
    this.totalcount=0;
    if (this.activeTab === 'Parked') {
      this.getParkedVehicles();
    } else if (this.activeTab === 'Balance') {
        if(this.service.id!=""){
          this.callCheckBalance();
        }else{
          this.toaster.info("please select a parking space");
        }
    } 
    else if (this.activeTab === 'Clear') {
        if(this.service.id!=""){
          this.getclearManual();
        }else{
          this.toaster.info("please select a parking space");
        }
    } 
  }
}
