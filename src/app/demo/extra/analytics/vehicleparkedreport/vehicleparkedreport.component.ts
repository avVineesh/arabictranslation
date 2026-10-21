import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbAccordionModule, NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { GetParkingareaList } from '../parkingareareport/parkingareareport.modal';
import { Areafilter, ParkData, VehicleList, Vehicleparked } from './vehicleparkedreport.modal';
import { VehicleparkedService } from './vehicleparkedreport.service';

import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons-dt';
import 'pdfmake';
import 'jszip';
declare var $: any;
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-vehicleparkedreport',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgbAccordionModule,
    NgxSpinnerModule,
    SharedModule,
  ],
  providers: [DatePipe],
  templateUrl: './vehicleparkedreport.component.html',
  styleUrl: './vehicleparkedreport.component.scss'
})
export default class VehicleparkedreportComponent implements OnInit {
    @ViewChild('download') downloadTemplate!: TemplateRef<any>;
  logcode: any;
  parkedvehicle: Vehicleparked[];

  datafilter: ParkData;
  areaFilter: Areafilter;
  datas: any;
  list: VehicleList;
  date: any;
  vehicletype: void;
  cialdata: any=[];
  indexdata: any[];
  detaillog: any;
  showtable: number;
  lotname: any;
  showimg: number;
  imageurl: any;
  nameArray: any[] = [];
  orgname: string;
  resLength: any;
  isorg: number = 1;
  orglist: any;
  callfunction = 0;
  todate: string;
  activeTab: String = 'ParkingArea';
  showoption: any=false;
  filteroption:any;
  parkingspacelist: any;
  issummary: number;
  summary: any;
  selecttype:any
  exportdata: any[];
  isPdfGenerating = false;
  pdfProgress = 0;
  pdfStatus = '';
  rolename: string;
  //Tab
  setActiveTab(tab: String) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
  this.loadDataByTabFilter()
  }
  constructor(public service: VehicleparkedService, public toaster: ToastrService,
    public router: Router, public datepipe: DatePipe, public spinner: NgxSpinnerService, public modalService: NgbModal) { }

  ngOnInit() {
    // this.onGetParkedvehicleReport();
    this.issummary=0;
    this.date = '';
    this.todate = '';
    this.nameArray = [];
    this.getParkingspaceList();
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.service.entryexit=3;
    this.orgname = localStorage.getItem('orgname');
    this.rolename= localStorage.getItem('rolename');
    this.getOrgList();
    // this.loadDataByTab();
    this.resetform();
  }

  loadDataByTab() {
    this.issummary=0;
    this.cialdata=[];
    if (this.activeTab === 'ParkingArea') {
      this.getLog();
    } else if(this.activeTab == 'unbilled') {
      this.onGetUnbilledvehicleReport();
    }else{
      this.getUnbilledExit();
    }
  }
  loadDataByTabFilter() {
    this.exportdata = [];
    if (this.date == '' && this.todate == '') {
      this.loadDataByTab();
      return
    } else {
      const from = new Date(this.date);
      const to = new Date(this.todate);

      const diffMs = to.getTime() - from.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const today = new Date();

      const daysInCurrentMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();


      if (this.activeTab == 'ParkingArea') {
        if (diffDays <= daysInCurrentMonth) {
          this.getLog()
        } else {
          this.filterFunction();

        }
      } else if (this.activeTab == 'unbilled') {
        this.exportdata = [];
        if (diffDays <= daysInCurrentMonth) {
          this.onGetUnbilledvehicleReport()
        } else {
          this.filterunbilled();

        }
      }
      else if (this.activeTab == 'ube') {
        this.exportdata = [];
        if (diffDays <= daysInCurrentMonth) {
          this.getUnbilledExit()
        } else {
          this.filterunbilledExit();

        }
      }
      
    }
  }
  detailedLog(detailed: ElementRef) {
    this.modalService.open(detailed, { size: 'lg' });
  }
  viewImg(img: ElementRef) {
    this.modalService.open(img, { size: 'lg' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.datafilter = {
      parking_lot_id: "",
      date: "",
      token: "",
      hours: ''
    }
    this.areaFilter = {
      parking_lot_id: "",

      token: "",

    }
    this.service.filterdata = {
      parkingspaceid: "",
      vehtype: "",
      staffid: "",
      token: "",
      date: ""
    }
    this.selecttype='3'
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
      // if (this.activeTab == 'ParkingArea') {
      //   this.getLog();
      // } else {
      //   this.onGetUnbilledvehicleReport();
      // }
  this.loadDataByTabFilter();
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
  onGetParkedvehicleReport() {
    this.service.GetParkedVehicleReport()
      .subscribe((Response: Vehicleparked[]) => {
        this.logcode = Response["Response"][0][0]["_logcode"];
        if (this.logcode == '1570') {
          this.date = new Date();
          this.list = Response["Response"][2];
          this.vehicletype = Response["Response"][3];
          if (Response["Response"][1].length != 0) {
            this.parkedvehicle = Response["Response"][1];
            this.DataTable();
          } else {
            this.toaster.info("No parking available!");
            this.date = new Date();
          }
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
  onGetParkingList() {

    this.service.GetParkingAreaList()
      .subscribe((Response: GetParkingareaList[]) => {
        this.datas = Response["Response"][1];
        this.logcode = Response["Response"][0][0]["_logcode"];
        this.toaster.info('Select a parking Space!');
        if (this.logcode == '1491') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
  }
  htmlelement: HTMLInputElement;
  hourSelected() {
  }

  nameSelected(event: any) {  //function for binding parking area id
    this.service.filterdata.parkingspaceid = event.target.value;
    this.areaFilter.parking_lot_id = event.target.value;
    this.getLog();
  }
  vehSelected(event: any) {
    this.service.filterdata.vehtype = event.target.value;
  }
  staffSelected(event: any) {
    this.service.filterdata.staffid = event.target.value;
  }
  filterReport() {
    if (this.service.filterdata.parkingspaceid == '') {
      this.service.filterdata.parkingspaceid = '0';
    }
    if (this.service.filterdata.vehtype == '') {
      this.service.filterdata.vehtype = '0';
    }
    if (this.service.filterdata.staffid == '') {
      this.service.filterdata.staffid = '0';
    }
    this.service.filterdata.date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.service.filterparkingAreaData().subscribe((Response) => {
      let filterlog = Response["Response"][0][0]["_logcode"];
      if (filterlog == '2360') {
        if (Response["Response"][1].length != 0) {
          this.parkedvehicle = Response["Response"][1];
        } else {
          this.toaster.info("No data available!");
          this.parkedvehicle = [];
        }
        $('#mytable').DataTable().destroy();
        this.DataTable();
      }
    });
  }
 getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

DataTable() { // function for creating  datatable 
     $('#mytable').DataTable().destroy();

  const currentDateTime = this.getCurrentDateTime();
  const from = this.date;
  const to = this.todate;
  $(document).ready(()=> {
    var table = $('#mytable').DataTable({
      dom: "Bfrtip",
       columnDefs: this.columnOptions.map((col, i) => ({
        targets: i,
        visible: col.selected
      })),
      buttons: [
        {
          extend: 'pdfHtml5',
          text: 'PDF',
          title: 'Parkingarea Report',
          messageTop: `Report generated Date & Time: ${currentDateTime},
                       Filtered From: ${from} To: ${to}`,
          customize: (doc: any) => {
            // Set page layout
            doc.pageOrientation = 'landscape';
            doc.pageSize = 'A3';
            doc.pageMargins = [20, 60, 20, 40];

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
                  text: 'Parkingarea Report',
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
              tableNode.table.widths = new Array(colCount).fill('*');
            }

            // Style adjustments
            doc.defaultStyle.fontSize = 9;
            doc.styles.tableBodyEven.alignment = 'center';
            doc.styles.tableBodyOdd.alignment = 'center';
            doc.content.forEach((item: any) => {
              if (item.table) item.layout = 'lightHorizontalLines';
            });
          },
          exportOptions: { columns: this.selectedColumnIndexes }
        },
        {
          extend: 'excel',
          text: 'EXCEL',
          title: 'Parkingarea Report',
          messageTop: `Report generated Date & Time: ${currentDateTime},
                       Filtered From: ${from} To: ${to}`,
         exportOptions: { columns: this.selectedColumnIndexes }
        }
      ]
    });

    table.draw();
  });
  this.spinner.hide();
  }

  // for Cial ParkingLog....................................................
  getLog() {
     $('#mytable').DataTable().destroy();
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.cialdata=[];
    this.service.cialReport(this.areaFilter).subscribe((Response) => {
     
      let logcode = Response["Response"][0][0]['_logcode'];
      if (logcode == '0') {
        if (Response["Response"][1].length != 0) {
          this.cialdata = Response["Response"][1];
          this.DataTable();
        } else {
          this.toaster.info("No data available!");
          this.cialdata=[];
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
    })
  }
// For Unbilled ANPR Report 
   onGetUnbilledvehicleReport() {
     $('#mytable').DataTable().destroy();
    this.spinner.show();
    this.cialdata=[];
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.service.GetUnbilledParkedVehicleReport()
      .subscribe((Response) => {
        let logcode = Response["Response"][0][0]["_logcode"];
        if (logcode == '1770') {
          if (Response["Response"][1].length != 0) {
            this.cialdata = Response["Response"][1];
            this.DataTable();
          } else {
            this.toaster.info("No Data!");
            this.cialdata=[];
            this.DataTable();
            
          }
          this.spinner.hide();
        }
        else {
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
  getIndex(i: any) {
    this.indexdata = Array(this.cialdata[i]);
    this.lotname = this.indexdata[0]["parkingnumber"];
    if (this.indexdata[0]['imgurl'] != '0') {
      this.showimg = 1;
      this.imageurl = JSON.parse(this.indexdata[0]['imgurl']);
    } else {
      this.showimg = 0;
    }
  }
  getDetailedLog() {
    this.spinner.show();
    this.detaillog = [];
    this.showtable = 2;
    this.service.getDetailedLog().subscribe((Response) => {
      let logcode = Response["Response"][0][0]['_logcode'];
      if (logcode == '10') {
        if (Response["Response"][1].length != 0) {
          this.detaillog = Response["Response"][1];
          this.drawdatatable();
          this.showtable = 1;
          this.spinner.hide();
        } else {
          this.showtable = 0;
          this.toaster.info("No data available!");
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

  columnOptions = [
    { label: 'Parkingspace Name', selected: true },
    { label: 'Vehicle Number', selected: true },
    { label: 'Entry/Exit', selected: true },
    { label: 'Date', selected: true },
    { label: 'Image', selected: true }
  ];

  get selectedColumnIndexes(): number[] {
    return this.columnOptions
      .map((col, i) => col.selected ? i : -1)
      .filter(i => i !== -1);
  }

  // ngAfterViewInit() {
  //   this.DataTable();
  // }

  onColumnChange() {
    this.DataTable();
  }

  private initDataTable() {
    if ($.fn.dataTable.isDataTable('#mytable')) {
      $('#mytable').DataTable().destroy();
    }

    setTimeout(() => {
      $('#mytable').DataTable({
        dom: 'Bfrtip',
        ordering: false,
        buttons: ['copy', 'csv', 'print'].map(type => ({
          extend: type,
          exportOptions: { columns: this.selectedColumnIndexes }
        })),
        columnDefs: this.columnOptions.map((col, i) => ({
          targets: i,
          visible: col.selected
        }))
      });
    }, 0);
  }

  drawdatatable() {
    $('#mytable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
 toogleOptions(){
    if(this.showoption){
      this.showoption=false
    }else{
      this.showoption=true
    }
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
      this.service.id=event.target.value;
      this.service.isorg=0;
      this.service.isendpoint=1;
      this.loadDataByTabFilter();
  }
   getEntryExit(event:any){
    this.service.entryexit=event.target.value;
  }
  loadSummary(){
    $('#summarytable').DataTable().destroy();
    this.summary=[];
    if(this.date=='' || this.todate==''){
      this.toaster.info("Please select a Date Range")
    }else{
      this.spinner.show()
      this.service.date = this.date;
    this.service.todate = this.todate;
    this.issummary=1
    this.service.getSummary().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode =='10'){
        this.summary=Response["Response"][1];
        this.summaryDataTable();
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
    
  }

  summaryDataTable() { // function for creating  datatable 
     $('#summarytable').DataTable().destroy();

  const currentDateTime = this.getCurrentDateTime();
  const from =this.datepipe.transform(this.date,'yyyy-MM-dd')
  const todate=this.datepipe.transform(this.todate,'yyyy-MM-dd')
  $(document).ready(function () {
    var table = $('#summarytable').DataTable({
      dom: "Bfrtip",
      buttons: [
        {
          extend: 'pdfHtml5',
          text: 'PDF',
          title: 'Parkingarea Report Vehicle Count -Summary',
          messageTop: `Report generated Date & Time: ${currentDateTime}, 
                       Date Filtered FROM: ${from} TO: ${todate}`,
          customize: (doc: any) => {
            // Set page layout
            doc.pageOrientation = 'landscape';
            doc.pageSize = 'A4';
            doc.pageMargins = [20, 60, 20, 40];

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
                  text: 'Parkingarea Report Vehicle Count -Summary',
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
              tableNode.table.widths = new Array(colCount).fill('*');
            }

            // Style adjustments
            doc.defaultStyle.fontSize = 9;
            doc.styles.tableBodyEven.alignment = 'center';
            doc.styles.tableBodyOdd.alignment = 'center';
            doc.content.forEach((item: any) => {
              if (item.table) item.layout = 'lightHorizontalLines';
            });
          },
          exportOptions: {
            modifier: { page: 'all' }
          }
        },
        {
          extend: 'excel',
          text: 'EXCEL',
          title: 'Parkingarea Report Vehicle Count -Summary',
          messageTop: `Report generated Date & Time: ${currentDateTime}, 
                       Date Filtered FROM: ${from} TO: ${todate}`,
          exportOptions: {
            modifier: { page: 'all' }
          }
        }
      ]
    });

    table.draw();
  });
  this.spinner.hide();
  }
filterFunction(){
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.exportdata=[];
    this.service.cialReport(this.areaFilter).subscribe((Response) => {
     
      let logcode = Response["Response"][0][0]['_logcode'];
      if (logcode == '0') {
        if (Response["Response"][1].length != 0) {
          this.exportdata = Response["Response"][1];
           setTimeout(() => {
              this.modalService.open(this.downloadTemplate, {
                size: 'md',
                centered: true,
                backdrop: 'static'
              });
            });
            this.spinner.hide();
          this.toaster.info('Data fetched successfully. Please select a file format (Excel or PDF) to export.');
        } else {
          this.toaster.info("No data available!");
          this.cialdata=[];
          this.exportdata=[];
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

filterunbilled(){
    this.spinner.show();
    this.exportdata=[];
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.service.GetUnbilledParkedVehicleReport()
      .subscribe((Response) => {
        let logcode = Response["Response"][0][0]["_logcode"];
        if (logcode == '1770') {
          if (Response["Response"][1].length != 0) {
            this.exportdata = Response["Response"][1];
              setTimeout(() => {
              this.modalService.open(this.downloadTemplate, {
                size: 'md',
                centered: true,
                backdrop: 'static'
              });
            });
            this.spinner.hide();
          this.toaster.info('Data fetched successfully. Please select a file format (Excel or PDF) to export.');
          } else {
            this.toaster.info("No Data!");
            this.cialdata=[];
           this.exportdata=[];
             this.spinner.hide();
          }
         
        }
        else {
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
exportExcel() {
    this.spinner.show();
    const summary = [
      [`Parkingarea Report`],
      [
        `Report generated Date & Time: ${new Date().toLocaleString()},  
Filtered From : ${this.date || ''} To: ${this.todate || ''},`
      ]
    ];

    const headers = [[
      'Parkingspace Name',
      'Vehicle Number',
      'Entry/Exit',
      'Date',
    ]];

    const data = this.exportdata.map((item: any) => [
      item.parking_lot_name,
      item.vehno,
      item.type,
      item.curstarttime
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      ...summary,
      ...headers,
      ...data
    ]);

    // Merge title row
    ws['!merges'] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 13 }
      },
      {
        s: { r: 1, c: 0 },
        e: { r: 1, c: 13 }
      }
    ];

    // Column widths
    ws['!cols'] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 18 },
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const now = new Date();

    const fileNameDate =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0') +
      '_' +
      String(now.getHours()).padStart(2, '0') +
      '-' +
      String(now.getMinutes()).padStart(2, '0') +
      '-' +
      String(now.getSeconds()).padStart(2, '0');

    XLSX.writeFile(
      wb,
      `Parkingarea Report_${fileNameDate}.xlsx`
    );
    this.spinner.hide();
  }
  exportPDF() {
  
      this.isPdfGenerating = true;
      this.pdfProgress = 0;
      this.pdfStatus = 'Preparing data...';
  
      const totalRows = this.exportdata.length;
      let processedRows = 0;
  
      // allow UI to render
      setTimeout(() => {
  
        const doc = new jsPDF('l', 'mm', 'a4');
        const generatedTime = new Date().toLocaleString();
  
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Parkingarea Report', 14, 25);
  
        const summaryText = [
          `Filtered From : ${this.date || ''} To : ${this.todate || ''}`
        ];
  
        let yPosition = 32;
  
        summaryText.forEach((line: string) => {
          doc.text(line, 14, yPosition);
          yPosition += 5;
        });
  
        this.pdfProgress = 10;
        this.pdfStatus = 'Building table...';
  
        autoTable(doc, {
          startY: yPosition + 5,
  
          head: [[
             'Parkingspace Name',
      'Vehicle Number',
      'Entry/Exit',
      'Date',
          ]],
  
          body: this.exportdata.map((item: any, index: number) => {
  
            processedRows++;
  
            // update progress per row
            this.pdfProgress = Math.floor((processedRows / totalRows) * 80) + 10;
  
            this.pdfStatus = `Processing row ${processedRows} of ${totalRows}`;
  
            return [
             item.parking_lot_name,
      item.vehno,
      item.type,
      item.curstarttime
            ];
          }),
  
          theme: 'grid',
  
          styles: {
            fontSize: 7,
            cellPadding: 2,
            overflow: 'linebreak'
          },
  
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold'
          },
  
          willDrawPage: (data) => {
  
            const pageWidth = doc.internal.pageSize.getWidth();
  
            doc.setFontSize(14);
            doc.text('ELVICTO TECHNOLOGIES', pageWidth / 2, 10, { align: 'center' });
  
            doc.setFontSize(8);
            doc.text(`Generated: ${generatedTime}`, pageWidth - 10, 10, { align: 'right' });
          }
        });
  
        this.pdfProgress = 95;
        this.pdfStatus = 'Finalizing PDF...';
  
        const now = new Date();
  
        const fileNameDate =
          now.getFullYear() +
          '-' +
          String(now.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(now.getDate()).padStart(2, '0') +
          '_' +
          String(now.getHours()).padStart(2, '0') +
          '-' +
          String(now.getMinutes()).padStart(2, '0') +
          '-' +
          String(now.getSeconds()).padStart(2, '0');
  
        setTimeout(() => {
  
          doc.save(`Parkingarea Report_${fileNameDate}.pdf`);
  
          this.pdfProgress = 100;
          this.pdfStatus = 'Download started';
  
          setTimeout(() => {
            this.isPdfGenerating = false;
          }, 500);
  
        }, 200);
  
      }, 50);
    }
    getUnbilledExit(){
       $('#mytable').DataTable().destroy();
    this.spinner.show();
    this.cialdata=[];
    this.service.date = this.date;
    this.service.todate = this.todate;
     this.service.getUnbilledExitVehicles()
      .subscribe((Response) => {
        let logcode = Response["Response"][0][0]["_logcode"];
        if (logcode == '8500') {
          if (Response["Response"][1].length != 0) {
            this.cialdata = Response["Response"][1];
            this.DataTable();
          } else {
            this.toaster.info("No Data!");
            this.cialdata=[];
            this.DataTable();
            
          }
          this.spinner.hide();
        }
        else {
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

    filterunbilledExit(){
       this.spinner.show();
    this.exportdata=[];
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.service.getUnbilledExitVehicles()
      .subscribe((Response) => {
        let logcode = Response["Response"][0][0]["_logcode"];
        if (logcode == '8500') {
          if (Response["Response"][1].length != 0) {
            this.exportdata = Response["Response"][1];
              setTimeout(() => {
              this.modalService.open(this.downloadTemplate, {
                size: 'md',
                centered: true,
                backdrop: 'static'
              });
            });
            this.spinner.hide();
          this.toaster.info('Data fetched successfully. Please select a file format (Excel or PDF) to export.');
          } else {
            this.toaster.info("No Data!");
            this.cialdata=[];
           this.exportdata=[];
             this.spinner.hide();
          }
         
        }
        else {
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
