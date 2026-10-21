import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbAccordionModule, NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { GetParkingareaList, ParkData, ParkingAreaReportData } from './parkingareareport.modal';
import { ParkingareaService } from '../../parkingsettings/parkingarea/parkingarea.service';
import { ParkingareareportService } from './parkingareareport.service';
import { VehiclecategoryService } from '../../adminsettings/vehiclecategory/vehiclecategory.service';

import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons-dt';
import 'pdfmake';
import 'jszip';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-parkingareareport',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgbAccordionModule,
    SharedModule,
    NgxSpinnerModule,
  ],
  providers: [DatePipe],
  templateUrl: './parkingareareport.component.html',
  styleUrl: './parkingareareport.component.scss'
})
export default class ParkingareareportComponent implements OnInit {
    @ViewChild('download') downloadTemplate!: TemplateRef<any>;
  activeTab: string = 'Daily';
  showoption: boolean = false;
  parkingspacelist: any;
  totalentry: any;
  totalexit: any;
  exportdata: any[];
  exportzerobilldata: any[];
  filtertotalentry: number;
  filtertotalexit: number;
  isPdfGenerating = false;
  pdfProgress = 0;
  pdfStatus = '';
  setActiveTab(tab: string) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.loadDataByTabFilter();
  }

  resetColumnOptions() {
    this.columnOptions = [
      { label: 'Parking Space Name', selected: true },
      { label: 'Entry Type', selected: true },
      { label: 'Vehicle Type', selected: true },
      { label: 'Vehicle Number', selected: true },
      { label: 'Customer type', selected: true },
      { label: 'Owner Phone Number', selected: true },
      { label: 'Start Date', selected: true },
      { label: 'Entry Image', selected: true },
      { label: 'End Date', selected: true },
      { label: 'Exit Image', selected: true },
      { label: 'Duration(Hr)', selected: true },
      { label: 'Amount', selected: true },
      { label: 'Status', selected: true }
    ];

    this.initDataTable(); // Reinitialize DataTable with updated columns
  }

  datas: GetParkingareaList[];
  logcode: any;
  roleindex: GetParkingareaList[];
  report: ParkingAreaReportData[];
  DataFilter: ParkData;
  dtExportButtonOptions: any = {};
  now: number;

  // @ViewChild(DataTableDirective)
  // dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject();
  date: any;
  VehType: any;
  log: any;
  log1: any[];
  logcode1: any;
  indexdata: ParkingAreaReportData[];
  showimg: number;
  imageurl: any;
  isorg: number = 1;
  resLength: any;
  orglist: any;
  callfunction: number;
  nameArray: any[] = [];
  orgname: string;
  todate: any;
  filteroption: any;
  constructor(
    public service: ParkingareareportService,
    public toaster: ToastrService, public router: Router,
    public ParkSpace: ParkingareaService,
    public VehicleType: VehiclecategoryService,
    public datepipe: DatePipe,
    public modalService: NgbModal,
    public spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.nameArray = [];
    this.date = '';
    this.todate = '';
    this.getParkingspaceList();
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    this.orgname = localStorage.getItem('orgname');
    this.service.isorg = 1;
    this.getOrgList();
    this.callfunction = 0;
    //this.onGetParkingList();
    this.resetform();
    //this.OnGetVehicleType();

    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
  }

  loadDataByTab() {
    this.report = [];
    if (this.activeTab === 'Daily') {
      this.OnGetParkReportAll();
    } else if (this.activeTab === 'Zero') {
      this.onZeroEntryBillReport();
    }
    // else if (this.activeTab === 'Forced'){
    // }
  }

  loadDataByTabFilter() {
    this.exportdata = [];
    this.exportzerobilldata = [];
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


      if (this.activeTab == 'Daily') {
        if (diffDays <= daysInCurrentMonth) {
          this.OnGetParkReportAll()
        } else {
          this.filterFunction();

        }
      } else if (this.activeTab == 'Zero') {
        this.exportdata = [];
        if (diffDays <= daysInCurrentMonth) {
          this.onZeroEntryBillReport()
        } else {
          this.filterZerobill();

        }
      }
    }
  }

  viewImg(img: ElementRef) {
    this.modalService.open(img, { size: 'lg' });
  }

  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.FormData = {
      token: "",
      parking_lot_id: "",
    },

      this.DataFilter = {
        parking_lot_id: "",
        date: "",
        token: "",
        VType: '',
        entrytype: ''
      }
  }

  getOrgList() {
    this.service.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.service.isorg = this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.service.isorg = this.isorg;
      }
      if (logcode == '10000') {
        if (this.resLength != '2') {
          this.orglist = Response["Response"][1];
        }
      } else {
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

      // if (this.activeTab == 'Daily') {
      //   this.OnGetParkReportAll();
      // } else if (this.activeTab == 'Zero') {
      //   this.onZeroEntryBillReport();
      // }
      this.loadDataByTabFilter();
      // else if(this.activeTab == 'Forced'){

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

  OnGetParkReportAll() {
    this.totalentry = 0;
    this.totalexit = 0;
    $('#mytable').DataTable().destroy();
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.report = [];
    this.service.GetParkAll().subscribe((Response) => {
      this.log = Response["Response"];
      this.logcode1 = Response["Response"][0];
      this.log1 = Response["Response"][1];
      if (this.log == undefined || this.log1.length <= 0) {
        this.toaster.info("No Parking Details");
        this.report = [];
        this.DataTable();
        //this.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      }
      else {
        this.report = Response["Response"][1];
        this.totalentry = Response["Response"][3][0]["totalentry"];
        this.totalexit = Response["Response"][3][0]["totalexit"];
        //this.toaster.info("Today's Parking Details");
        //this.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        this.DataTable();
      }
    });
  }

  onGetParkingList() {
    this.service.GetParkingAreaList()
      .subscribe((Response: GetParkingareaList[]) => {
        this.datas = Response["Response"][1];
        this.logcode = Response["Response"][0][0]["_logcode"];
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


  OnGetVehicleType() {

    this.VehicleType.GetVehicleCateory().subscribe((Response) => {
      this.VehType = Response["Response"][1];
    });
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

  // DataTable() { // function for creating  datatable 

  //     $('#mytable').DataTable().destroy();
  //     const currentDateTime = this.getCurrentDateTime();
  //     $(document).ready(function () {
  //       var table = $('#mytable') .DataTable({
  //         dom: "Bfrtip",
  //         buttons:  [
  //           {
  //               extend: 'pdfHtml5',
  //               text: 'PDF',
  //                messageTop: `Report generated Date & Time: ${currentDateTime}`,
  //               title:'Daily Transaction Report',
  //               customize: (doc:any) => {
  //                  // Calculate page dimensions
  //  // Define the header with an image
  //  doc.header = function() {
  //   return {
  //     columns: [
  //       {
  //         text: 'Daily Transaction Report',
  //         alignment: 'center',
  //         fontSize: 20,
  //         margin: [0, 10],
  //         width: '*'
  //       },
  //       {
  //         text: `Report generated Date & Time: ${currentDateTime}`,
  //         alignment: 'right',
  //         margin: [10, 10]
  //       }

  //     ],
  //     margin: [10, 10]
  //   };
  // };
  //                 var watermarkText = 'ELVICTO TECHNOLOGIES'; // Your watermark text
  //                     doc['watermark'] = {
  //                         text: watermarkText,
  //                         color: 'blue', // Watermark color
  //                         opacity: 0.1, // Watermark opacity
  //                         fontSize:30,
  //                         bold: true,
  //                         italics: false
  //                     };

  //                  // Add image watermark to the background

  //                 // Add footer to each page
  //                 doc['footer'] = (currentPage, pageCount) => {
  //                   return {
  //                     columns: [
  //                       {

  //                         text: `Report generated Date & Time: ${currentDateTime}`,
  //                         alignment: 'center'
  //                       }
  //                     ],
  //                     margin: [10, 0]
  //                   };
  //                 };

  //               },
  //               exportOptions: {
  //                   modifier: {
  //                       page: 'all'

  //                   }
  //               }
  //           },

  //           {
  //             extend: 'excel',
  //             text: 'EXCEL',
  //             title:'Daily Transaction Report',
  //             messageTop:
  //                         `Report generated Date & Time: ${currentDateTime}`,
  //             exportOptions: {
  //                 modifier: {
  //                     page: 'all'
  //                 }
  //             }
  //         }
  //       ]
  //       });
  //       table.draw();

  //     });
  //   }

  DataTable() {
    $('#mytable').DataTable().destroy();

    const currentDateTime = this.getCurrentDateTime();
    const from = this.date;
    const to = this.todate;
    const totalentry = this.totalentry;
    const totalexit = this.totalexit;
    $(document).ready(() => {
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
            title: 'Daily Transaction Report',
            messageTop: `Report generated Date & Time: ${currentDateTime},
                      Filtered From: ${from} To: ${to},
                      Total Entry(Count): ${totalentry}  TotalExit: ${totalexit}`,

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
                    text: 'Daily Transaction Report',
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
            title: 'Daily Transaction Report',
            messageTop: `Report generated Date & Time: ${currentDateTime},
                      Filtered From: ${from} To: ${to},
                      Total Entry(Count): ${totalentry}  TotalExit: ${totalexit}`,
            exportOptions: { columns: this.selectedColumnIndexes }
          }
        ]
      });

      table.draw();
    });
    this.spinner.hide();
  }


  entrytypefilter(event: any) {  // function for binfing the vehicle category id
    this.DataFilter.entrytype = event.target.value;
  }

  parkingspacefilter(event: any) {  // function for binding the parking spaceid
    this.DataFilter.parking_lot_id = event.target.value;
  }
  newFilter() {
    if (this.DataFilter.entrytype == '') {
      this.DataFilter.entrytype = '2';
    }
    if (this.DataFilter.parking_lot_id == '') {
      this.DataFilter.parking_lot_id = '0';
    }
    this.DataFilter.date = this.date;
    this.service.filterDailycollection(this.DataFilter).subscribe((Response) => {
      let filterlog = Response["Response"][0][0]["_logcode"];
      if (filterlog == '1560') {
        if (Response["Response"][1].length != 0) {
          this.report = Response["Response"][1];
          $('#mytable').DataTable().destroy();
          this.DataTable();
        } else {
          this.report = [];
          this.DataTable();
          this.toaster.info("No Parking!");
        }
      }
    });
  }

  getIndex(i: any) {
    this.indexdata = Array(this.report[i]);
    this.service.parkinglogid = this.indexdata[0]["id"];
  }

  columnOptions = [
    { label: 'Parking Space Name', selected: true },
    { label: 'Entry Type', selected: true },
    { label: 'Vehicle Type', selected: true },
    { label: 'Vehicle Number', selected: true },
    { label: 'Customer type', selected: true },
    { label: 'Owner Phone Number', selected: true },
    { label: 'Start Date', selected: true },
    { label: 'Entry Image', selected: true },
    { label: 'End Date', selected: true },
    { label: 'Exit Image', selected: true },
    { label: 'Duration(Hr)', selected: true },
    { label: 'Amount', selected: true },
    { label: 'Status', selected: true }
  ];

  get selectedColumnIndexes(): number[] {
    return this.columnOptions
      .map((col, i) => col.selected ? i : -1)
      .filter(i => i !== -1);
  }

  ngAfterViewInit() {
    this.DataTable();
  }

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
    }, 10);
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
  toogleOptions() {
    if (this.showoption) {
      this.showoption = false
    } else {
      this.showoption = true
    }
  }
  // function for zero bill entry report
  onZeroEntryBillReport() {
    this.totalentry = 0;
    this.totalexit = 0;
    $('#mytable').DataTable().destroy();
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.report = [];

    this.service.GetParkAll().subscribe((Response) => {
      this.log = Response["Response"];
      this.logcode1 = Response["Response"][0];
      this.log1 = Response["Response"][2];
      if (this.log == undefined || this.log1.length <= 0) {
        this.toaster.info("No Parking Details");
        this.report = [];
        this.DataTable();
        //this.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      }
      else {
        this.report = Response["Response"][2];
        this.totalentry = Response["Response"][3][0]["totalentry"];
        this.totalexit = Response["Response"][3][0]["totalexit"];
        this.DataTable();
      }
    });
    this.spinner.hide();
  }
  getParkingspaceList() {
    this.service.GetParkingAreaList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode = '1490') {
        this.parkingspacelist = Response["Response"][1];
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  }
  parkispaceFilter(event: any) {
    this.service.id = event.target.value;
    this.service.isorg = 0;
    this.service.isendpoint = 1;
    // 
    this.loadDataByTabFilter();
  }
  filterFunction() {
    this.filtertotalentry = 0;
    this.filtertotalexit = 0;
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.exportdata = [];
    this.service.GetParkAll().subscribe((Response) => {
      this.log = Response["Response"];
      this.logcode1 = Response["Response"][0];
      this.log1 = Response["Response"][1];
      if (this.log == undefined || this.log1.length <= 0) {
        this.toaster.info("No Parking Details");
         this.report=[];
        this.exportdata = [];
        //this.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      }
      else {
        this.exportdata = Response["Response"][1];
        this.filtertotalentry = Response["Response"][3][0]["totalentry"];
        this.filtertotalexit = Response["Response"][3][0]["totalexit"];
         setTimeout(() => {
              this.modalService.open(this.downloadTemplate, {
                size: 'md',
                centered: true,
                backdrop: 'static'
              });
            });
            this.spinner.hide();
          this.toaster.info('Data fetched successfully. Please select a file format (Excel or PDF) to export.');
      }
    });
  }

  filterZerobill() {
    this.filtertotalentry = 0;
    this.filtertotalexit = 0;
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.exportdata = [];

    this.service.GetParkAll().subscribe((Response) => {
      this.log = Response["Response"];
      this.logcode1 = Response["Response"][0];
      this.log1 = Response["Response"][2];
      if (this.log == undefined || this.log1.length <= 0) {
        this.toaster.info("No Parking Details");
        this.exportdata = [];
        this.report=[];
          this.spinner.hide();
      }
      else {
        this.exportdata = Response["Response"][2];
        this.filtertotalentry = Response["Response"][3][0]["totalentry"];
        this.filtertotalexit = Response["Response"][3][0]["totalexit"];
         setTimeout(() => {
              this.modalService.open(this.downloadTemplate, {
                size: 'md',
                centered: true,
                backdrop: 'static'
              });
            });
             this.spinner.hide();
          this.toaster.info('Data fetched successfully. Please select a file format (Excel or PDF) to export.');
      }
    });
  }

  exportExcel() {
    this.spinner.show();
    const summary = [
      [`Daily Transaction Report`],
      [
        `Report generated Date & Time: ${new Date().toLocaleString()},  
Filtered From : ${this.date || ''} To: ${this.todate || ''},
Total Entry: ${this.filtertotalentry},
Total Exit: ${this.filtertotalexit}`
      ]
    ];

    const headers = [[
      'Parking Space Name',
      'Entry Type',
      'Vehicle Type',
      'Vehicle Number',
      'Customer type',
      'Owner Phone Number',
      'Start Date',
      this.activeTab == 'Daily' ? 'End Date' : '',
      this.activeTab == 'Daily' ? 'Duration(Hr)' : '',
      'Amount',
      'Status',
    ]];

    const data = this.exportdata.map((item: any) => [
      item.parking_lot_name,
      item.type == 1 ? 'Fastag' : 'Manual',
      item.vehtype,
      item.vehicleno,
      item.custtype,
      item.phonenumber,
      item.startdate,
      this.activeTab == 'Daily' ? item.enddate : '',
      this.activeTab == 'Daily' ? item.duration : '',
      item.amount,
      item.status == 0 ? 'Completed' : 'Parked'
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
      `Daily Transaction Report_${fileNameDate}.xlsx`
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
      doc.text('Daily Transaction Report', 14, 25);

      const summaryText = [
        `Filtered From : ${this.date || ''} To : ${this.todate || ''}`,
        `Total Entry: ${this.filtertotalentry},
         Total Exit: ${this.filtertotalexit}`
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
          'Parking Space Name',
          'Entry Type',
          'Vehicle Type',
          'Vehicle Number',
          'Customer type',
          'Owner Phone Number',
          'Start Date',
          this.activeTab == 'Daily' ? 'End Date' : '',
          this.activeTab == 'Daily' ? 'Duration(Hr)' : '',
          'Amount',
          'Status',
        ]],

        body: this.exportdata.map((item: any, index: number) => {

          processedRows++;

          // update progress per row
          this.pdfProgress = Math.floor((processedRows / totalRows) * 80) + 10;

          this.pdfStatus = `Processing row ${processedRows} of ${totalRows}`;

          return [
            item.parking_lot_name,
            item.type == 1 ? 'Fastag' : 'Manual',
            item.vehtype,
            item.vehicleno,
            item.custtype,
            item.phonenumber,
            item.startdate,
            this.activeTab == 'Daily' ? item.enddate : '',
            this.activeTab == 'Daily' ? item.duration : '',
            item.amount,
            item.status == 0 ? 'Completed' : 'Parked'
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

        doc.save(`Daily Transaction Report_${fileNameDate}.pdf`);

        this.pdfProgress = 100;
        this.pdfStatus = 'Download started';

        setTimeout(() => {
          this.isPdfGenerating = false;
        }, 500);

      }, 200);

    }, 50);
  }

}