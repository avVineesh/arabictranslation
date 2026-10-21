import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { PaymentlogService } from './paymentlog.service';
import 'datatables.net';
import 'datatables.net-dt';
import 'datatables.net-buttons';
import 'datatables.net-buttons-dt';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/theme/shared/service/language.service';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-paymentlog',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule
  ],
  providers: [DatePipe],
  templateUrl: './paymentlog.component.html',
  styleUrl: './paymentlog.component.scss'
})
export default class PaymentlogComponent implements OnInit, OnDestroy {
  @ViewChild('invoice') invoice!: ElementRef<any>;
  @ViewChild('buttonclose') buttonclose: ElementRef<any>;
  @ViewChild('download') downloadTemplate!: TemplateRef<any>;
  logcode: any;
  paymentdata: any;
  parkingarea: any;
  filterlogcode: any;
  date: any;
  todate: any;
  total: any = 0;
  isorg: number = 1;
  callfunction = 0;
  orgid: any;
  contactnumber: any;
  resLength: any;
  orgname: any;
  nameArray: any[] = [];
  orglist: any;
  dtExportButtonOptions: any = {};
  statuscontrol = new FormControl('');
  showoption: boolean = false;
  parkingspacelist: any;
  filteroption: any;
  activeTab: string = 'paymentlog';
  selectedPaymentMode: any = null;
  selectedPaymentStatus: any = null;
  key: any;
  safeUrl!: SafeResourceUrl;
  data: any[];
  showphone: number;
  totalfail: number;
  totalsuccess: number;
  totalcount: number;
  showpayment: number;
  flagdata: any[];
  exportpaymentdata: any;
  filtertotalfail: number;
  filtertotalsuccess: number;
  filtertotalcount: number;
  filtertotal: any;
  showexport: number;
  isPdfGenerating = false;
  pdfProgress = 0;
  pdfStatus = '';

  private langSub?: Subscription;

  constructor(public paymentservice: PaymentlogService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService, public datepipe: DatePipe, public modalService: NgbModal, public sanitizer: DomSanitizer,
    private translate: TranslateService, private languageService: LanguageService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.statuscontrol.setValue('3');
    this.date = ''
    this.todate = ''
    this.paymentservice.status = '3';
    this.paymentservice.mode = '0';
    this.nameArray = [];
    this.getParkingspaceList();
    this.paymentservice.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.paymentservice.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.paymentservice.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
    //this.getPaymentLog();
    this.resetform();
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };

    // Language handling
    this.langSub = this.languageService.currentLang$.subscribe(lang => {
      this.translate.use(lang);
      try {
        this.cdr.detectChanges();
      } catch (e) {
        console.warn('detectChanges skipped (component likely destroyed):', e);
      }
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  addModal(invoice: ElementRef) {
    this.modalService.open(invoice, { size: 'md' });
  }
  downloadModal(download: ElementRef) {
    this.modalService.open(download, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.paymentservice.paymentmodal = {
      paymentid: "",
      razorpayid: "",
      paymentdate: "",
      isreceived: "",
      amount: "",
      fullname: "",
      parking_lot_name: "",
      phone: "",
      paymentstatus: "",
      vehicleno: "",
      token: "",
      parking_lot_id: ""
    }
    this.selectedPaymentMode = '0';
    this.selectedPaymentStatus = '3';
  }
  columnOptions = [
    { label: 'Invoiceid', selected: true },
    { label: 'Vehicle Number', selected: true },
    { label: 'Parking Area', selected: true },
    { label: 'Payid', selected: true },
    { label: 'Ref Invid', selected: true },
    { label: 'Issued By', selected: true },
    { label: 'Vehicle Type', selected: true },
    { label: 'Contact Number', selected: true },
    { label: 'Amount', selected: true },
    { label: 'Payment Date', selected: true },
    { label: 'Payment Type', selected: true },
    { label: 'Payment Status', selected: true },
    { label: 'Reconciliation Status', selected: true },
    { label: 'Invoice', selected: true }
  ];

  columnOptions1 = [
    { label: 'Invoiceid', selected: true },
    { label: 'Vehicle Number', selected: true },
    { label: 'Parking Area', selected: true },
    { label: 'Date', selected: true },
    { label: 'Ref Invid', selected: true },
    { label: 'Issued By', selected: true },
    { label: 'Vehicle Type', selected: true },
    { label: 'Contact Number', selected: true },
    { label: 'Collected Amount', selected: true },
    { label: 'Flagged Amount', selected: true },
    { label: 'Reason', selected: true },

  ];
  getOrgList() {
    this.paymentservice.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.paymentservice.isendpoint = 1;
        this.paymentservice.isorg = this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.paymentservice.isendpoint = 0;
        this.paymentservice.isorg = this.isorg;
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
      this.loadDataByTabFilter();
    });

  }
  selectEvent(event: any) {
    this.callfunction = 1;
    this.paymentservice.orgid = event.target.value;
    this.paymentservice.id = event.target.value;
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
    this.paymentservice.orgid = data;
    this.paymentservice.id = data;
    this.getOrgList();
    ;
  }
  getPaymentLog() {
    this.totalfail = 0;
    this.totalsuccess = 0;
    this.totalcount = 0;
    this.paymentdata = [];
    $('#mytable').DataTable().destroy();
    this.paymentservice.date = this.date;
    this.paymentservice.todate = this.todate;
    this.spinner.show();
    this.paymentservice.getPaymentDetails().subscribe((Response) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == '1320') {
        this.parkingarea = Response["Response"][2];
        if (Response["Response"][1].length != 0) {
          this.paymentdata = Response["Response"][1];
          this.total = Response["Response"][3][0]["total"];
          this.totalcount = Response["Response"][4][0]["totalcount"];
          this.totalfail = Response["Response"][4][0]["totalfail"];
          this.totalsuccess = Response["Response"][4][0]["totalsuccess"];
          this.spinner.hide();
          this.DataTable();
        } else {
          this.toaster.info("So far no Payment available!");
          this.total = 0;
          this.paymentdata = [];
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

  getFlagPaymentLog() {
    this.totalcount = 0;
    this.total = 0;
    this.flagdata = [];
    $('#mytable1').DataTable().destroy();
    this.paymentservice.date = this.date;
    this.paymentservice.todate = this.todate;
    this.spinner.show();
    this.paymentservice.getFlagPaymentDetails().subscribe((Response) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == '8520') {
        this.parkingarea = Response["Response"][2];
        if (Response["Response"][1].length != 0) {
          this.flagdata = Response["Response"][1];
          this.total = Response["Response"][3][0]["total"];
          this.totalcount = Response["Response"][4][0]["totalcount"];
          this.spinner.hide();
          this.DataTable1();
        } else {
          this.toaster.info("So far no Data available!");
          this.total = 0;
          this.flagdata = [];
          this.DataTable1();
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

    $('#mytable').DataTable().destroy();

    const currentDateTime = this.getCurrentDateTime();
    const totalamount = this.total;
    const from = this.date;
    const to = this.todate;
    const totalcount = this.totalcount;
    const success = this.totalsuccess;
    const failed = this.totalfail;
    $(document).ready(() => {
      var table = $('#mytable').DataTable({
        dom: "Bfrtip",
        ordering: false,
        drawCallback: function () {

          const api = this.api();
          const info = api.page.info();

          const container = $(api.table().container());

          // No data
          if (info.recordsTotal === 0) {

            container.find('.dataTables_paginate').hide();
            container.find('.dataTables_info').hide();

          } else {

            container.find('.dataTables_info').show();

            // Hide pagination if only one page
            if (info.pages <= 1) {
              container.find('.dataTables_paginate').hide();
            } else {
              container.find('.dataTables_paginate').show();
            }
          }
        },

        columnDefs: this.columnOptions.map((col, i) => ({
          targets: i,
          visible: col.selected
        })),
        buttons: [
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            title: 'Payment Details',

            exportOptions: {
              columns: ':visible'
            },

            messageTop: `Report generated Date & Time: ${currentDateTime},
                Filtered From : ${from} To: ${to},
                Total Amount Collected: ${totalamount},
                Total Count: ${totalcount},
                Success: ${success},
                Failed: ${failed}`,

            customize: (doc: any) => {

              doc.pageOrientation = 'landscape';
              doc.pageSize = 'A3';
              doc.pageMargins = [10, 60, 10, 40];

              // Watermark
              doc.watermark = {
                text: 'ELVICTO TECHNOLOGIES',
                opacity: 0.05,
                bold: true,
                fontSize: 40
              };

              // Header
              doc.header = {
                columns: [
                  {
                    text: 'ELVICTO TECHNOLOGIES - Payment Report',
                    bold: true,
                    fontSize: 14,
                    margin: [10, 10, 0, 0]
                  },
                  {
                    text: `Generated: ${currentDateTime}`,
                    alignment: 'right',
                    fontSize: 9,
                    margin: [0, 10, 10, 0]
                  }
                ]
              };

              // Footer
              doc.footer = function (currentPage: any, pageCount: any) {
                return {
                  text: `Page ${currentPage} of ${pageCount}`,
                  alignment: 'center',
                  fontSize: 9
                };
              };

              const tableNode = doc.content.find((c: any) => c.table);

              if (tableNode) {

                const colCount = tableNode.table.body[0].length;

                // Dynamic font scaling
                let fontSize = 9;

                if (colCount > 10) fontSize = 8;
                if (colCount > 15) fontSize = 7;
                if (colCount > 20) fontSize = 6;

                doc.defaultStyle.fontSize = fontSize;

                // Dynamic column width scaling
                tableNode.table.widths = Array(colCount).fill('*');

                // Wrap long text
                tableNode.table.body.forEach((row: any) => {
                  row.forEach((cell: any, i: number) => {

                    row[i] = {
                      text: typeof cell === 'object' ? cell.text : cell,
                      alignment: 'center',
                      noWrap: false
                    };

                  });
                });

                tableNode.layout = 'lightHorizontalLines';
              }

              doc.styles.tableHeader = {
                bold: true,
                fontSize: doc.defaultStyle.fontSize + 1,
                alignment: 'center'
              };

            }
          },

          {
            extend: 'excel',
            text: 'EXCEL',
            title: 'Payment Details',
            messageTop: `Report generated Date & Time: ${currentDateTime},
                Filtered From : ${from} To: ${to},
                Total Amount Collected: ${totalamount},
                Total Count: ${totalcount},
                Success: ${success},
                Failed: ${failed}`,
            exportOptions: { columns: this.selectedColumnIndexes }
          }
        ]
      });

      table.draw();
    });
    this.spinner.hide();
  }

  DataTable1() { // function for creating  datatable 

    $('#mytable1').DataTable().destroy();

    const currentDateTime = this.getCurrentDateTime();
    const totalamount = this.total;
    const from = this.date;
    const to = this.todate;
    const totalcount = this.totalcount;
    const success = this.totalsuccess;
    const failed = this.totalfail;
    $(document).ready(() => {
      var table = $('#mytable1').DataTable({
        dom: "Bfrtip",
        ordering: false,
        drawCallback: function () {

          const api = this.api();
          const info = api.page.info();

          const container = $(api.table().container());

          // No data
          if (info.recordsTotal === 0) {

            container.find('.dataTables_paginate').hide();
            container.find('.dataTables_info').hide();

          } else {

            container.find('.dataTables_info').show();

            // Hide pagination if only one page
            if (info.pages <= 1) {
              container.find('.dataTables_paginate').hide();
            } else {
              container.find('.dataTables_paginate').show();
            }
          }
        },
        columnDefs: this.columnOptions1.map((col, i) => ({
          targets: i,
          visible: col.selected
        })),
        buttons: [
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            title: 'Payment Flag Details',

            exportOptions: {
              columns: ':visible'
            },

            messageTop: `Report generated Date & Time: ${currentDateTime},
                Filtered From : ${from} To: ${to},
                Total Flag Amount: ${totalamount},
                Total Count: ${totalcount},
                `,

            customize: (doc: any) => {

              doc.pageOrientation = 'landscape';
              doc.pageSize = 'A3';
              doc.pageMargins = [10, 60, 10, 40];

              // Watermark
              doc.watermark = {
                text: 'ELVICTO TECHNOLOGIES',
                opacity: 0.05,
                bold: true,
                fontSize: 40
              };

              // Header
              doc.header = {
                columns: [
                  {
                    text: 'ELVICTO TECHNOLOGIES - Payment Flag Report',
                    bold: true,
                    fontSize: 14,
                    margin: [10, 10, 0, 0]
                  },
                  {
                    text: `Generated: ${currentDateTime}`,
                    alignment: 'right',
                    fontSize: 9,
                    margin: [0, 10, 10, 0]
                  }
                ]
              };

              // Footer
              doc.footer = function (currentPage: any, pageCount: any) {
                return {
                  text: `Page ${currentPage} of ${pageCount}`,
                  alignment: 'center',
                  fontSize: 9
                };
              };

              const tableNode = doc.content.find((c: any) => c.table);

              if (tableNode) {

                const colCount = tableNode.table.body[0].length;

                // Dynamic font scaling
                let fontSize = 9;

                if (colCount > 10) fontSize = 8;
                if (colCount > 15) fontSize = 7;
                if (colCount > 20) fontSize = 6;

                doc.defaultStyle.fontSize = fontSize;

                // Dynamic column width scaling
                tableNode.table.widths = Array(colCount).fill('*');

                // Wrap long text
                tableNode.table.body.forEach((row: any) => {
                  row.forEach((cell: any, i: number) => {

                    row[i] = {
                      text: typeof cell === 'object' ? cell.text : cell,
                      alignment: 'center',
                      noWrap: false
                    };

                  });
                });

                tableNode.layout = 'lightHorizontalLines';
              }

              doc.styles.tableHeader = {
                bold: true,
                fontSize: doc.defaultStyle.fontSize + 1,
                alignment: 'center'
              };

            }
          },

          {
            extend: 'excel',
            text: 'EXCEL',
            title: 'Payment Flag Details',
            messageTop: `Report generated Date & Time: ${currentDateTime},
                Filtered From : ${from} To: ${to},
                Total Amount Collected: ${totalamount},
                Total Count: ${totalcount},
                `,
            exportOptions: { columns: this.selectedColumnIndexes1 }
          }
        ]
      });

      table.draw();
    });
    this.spinner.hide();
  }
  getParkingArea(event: any) {
    this.paymentservice.paymentmodal.parking_lot_id = event.target.value;
  }
  getPaymentStatus(event: any) {
    this.paymentservice.paymentmodal.paymentstatus = event.target.value;
    this.paymentservice.status = event.target.value;
  }
  getPaymentFilter() {
    this.paymentservice.paymentmodal.paymentdate = this.date;
    this.paymentservice.getFilteredData().subscribe((Response) => {
      this.filterlogcode = Response["Response"][0][0]["_logcode"];
      if (this.filterlogcode == "2000") {
        if (Response["Response"][1].length != 0) {
          this.paymentdata = Response["Response"][1];
          this.total = Response["Response"][2][0]["total"];
        } else {
          this.toaster.warning("No Payment details");
          this.paymentdata = [];
          this.total = 0;
        }
        $('#mytable').DataTable().destroy();
        this.DataTable();
      }
    });
  }
  getPaymentMode(event: any) {
    this.paymentservice.mode = event.target.value
  }

  get selectedColumnIndexes(): number[] {
    return this.columnOptions
      .map((col, i) => col.selected ? i : -1)
      .filter(i => i !== -1);
  }
  get selectedColumnIndexes1(): number[] {
    return this.columnOptions1
      .map((col, i) => col.selected ? i : -1)
      .filter(i => i !== -1);
  }
  ngAfterViewInit() {
    this.DataTable();
  }

  onColumnChange() {
    // 
    this.DataTable();
  }

  onColumnChange1() {
    // 
    this.DataTable1();
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
  toogleOptions() {
    if (this.showoption) {
      this.showoption = false
    } else {
      this.showoption = true
    }
  }
  getParkingspaceList() {
    this.paymentservice.getParkingspacelist().subscribe((Response) => {
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
    this.paymentservice.id = event.target.value;
    this.paymentservice.isorg = 0;
    this.paymentservice.isendpoint = 1;
    this.loadDataByTabFilter();
  }

  setActiveTab(tab: string) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.loadDataByTab();
  }
  loadDataByTab() {
    this.paymentdata = [];
    this.flagdata = [];
    if (this.activeTab == 'paymentlog') {
      this.showpayment = 1
      this.getPaymentLog();
    } else if (this.activeTab == 'flag') {
      this.showpayment = 0
      this.paymentdata = [];
      this.getFlagPaymentLog();
    }
  }
  loadDataByTabFilter() {
    this.exportpaymentdata = [];
    this.flagdata = [];
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


      if (this.activeTab == 'paymentlog') {
        this.showpayment = 1
        if (diffDays <= daysInCurrentMonth) {
          this.showexport = 0;
          this.paymentdata = [];
          this.getPaymentLog()
        } else {
          this.filterFunction();

        }
      } else if (this.activeTab == 'flag') {
        this.showpayment = 0
        this.paymentdata = [];
        this.getFlagPaymentLog();
      }
    }

  }
  GetValueIndex(i: any) {
    this.showphone = 0;
    this.data = Array(this.paymentdata[i])
    this.key = this.data[0]['key'];
    const url = `https://ticket.csml.elvicto.in/?Id=${this.key}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.addModal(this.invoice);
  }
  resendSMS() {
    let phone = this.data[0]["phone"];
    if (phone == '' || phone == null) {
      this.toaster.info("Enter the contact number");
      this.showphone = 1
    } else {
      this.paymentservice.resendSMS(this.data[0]).subscribe((Response) => {
        if (Response) {
          this.toaster.info("got the response")
        }

      })
      this.toaster.success("Message Send Successfully");
      //  this.buttonclose.nativeElement.click();
    }
  }

  filterFunction() {
    this.filtertotalfail = 0;
    this.filtertotalsuccess = 0;
    this.filtertotalcount = 0;
    this.exportpaymentdata = [];
    this.paymentservice.date = this.date;
    this.paymentservice.todate = this.todate;
    this.spinner.show();
    this.paymentservice.getPaymentDetails().subscribe((Response) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == '1320') {
        this.parkingarea = Response["Response"][2];
        if (Response["Response"][1].length != 0) {
          this.exportpaymentdata = Response["Response"][1];
          this.filtertotal = Response["Response"][3][0]["total"];
          this.filtertotalcount = Response["Response"][4][0]["totalcount"];
          this.filtertotalfail = Response["Response"][4][0]["totalfail"];
          this.filtertotalsuccess = Response["Response"][4][0]["totalsuccess"];
          if (this.exportpaymentdata.length > 0) {
            this.showexport = 1
            setTimeout(() => {
              this.modalService.open(this.downloadTemplate, {
                size: 'md',
                centered: true,
                backdrop: 'static'
              });
            });
          }
          this.spinner.hide();
          this.toaster.info('Data fetched successfully. Please select a file format (Excel or PDF) to export.');
        } else {
          this.toaster.info("So far no Payment available!");
          this.exportpaymentdata = [];
          this.total = 0;
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




  exportExcel() {
    this.spinner.show();
    const summary = [
      [`Payment Details`],
      [
        `Report generated Date & Time: ${new Date().toLocaleString()},  
Filtered From : ${this.date || ''} To: ${this.todate || ''},
Total Amount Collected: ${this.filtertotal},
Total Count: ${this.filtertotalcount},
Success: ${this.filtertotalsuccess},
Failed: ${this.filtertotalfail}`
      ]
    ];

    const headers = [[
      'Invoiceid',
      'Vehicle Number',
      'Parking Area',
      'Payid',
      'Ref Invid',
      'Issued By',
      'Vehicle Type',
      'Contact Number',
      'Amount',
      'Payment Date',
      'Payment Type',
      'Payment Status',
    ]];

    const data = this.exportpaymentdata.map((item: any) => [
      item.invid,
      item.vehicleno,
      item.parking_lot_name,
      item.payid,
      item.refinvid,
      item.fullname,
      item.vehtype,
      item.phone,
      item.amount,
      item.paymentdate,
      item.paytype,
      item.isreceived == 0 ? 'Failure' : 'Success'
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
      `Payment_Details_${fileNameDate}.xlsx`
    );
    this.spinner.hide();
  }

  exportPDF() {

    this.isPdfGenerating = true;
    this.pdfProgress = 0;
    this.pdfStatus = 'Preparing data...';

    const totalRows = this.exportpaymentdata.length;
    let processedRows = 0;

    // allow UI to render
    setTimeout(() => {

      const doc = new jsPDF('l', 'mm', 'a4');
      const generatedTime = new Date().toLocaleString();

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Details', 14, 25);

      const summaryText = [
        `Filtered From : ${this.date || ''} To : ${this.todate || ''}`,
        `Total Amount Collected : ${this.filtertotal}`,
        `Total Count : ${this.filtertotalcount}`,
        `Success : ${this.filtertotalsuccess}`,
        `Failed : ${this.filtertotalfail}`
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
          'Invoice ID',
          'Vehicle Number',
          'Parking Area',
          'Pay ID',
          'Ref Invoice',
          'Issued By',
          'Vehicle Type',
          'Contact Number',
          'Amount',
          'Payment Date',
          'Payment Type',
          'Payment Status'
        ]],

        body: this.exportpaymentdata.map((item: any, index: number) => {

          processedRows++;

          // update progress per row
          this.pdfProgress = Math.floor((processedRows / totalRows) * 80) + 10;

          this.pdfStatus = `Processing row ${processedRows} of ${totalRows}`;

          return [
            item.invid,
            item.vehicleno,
            item.parking_lot_name,
            item.payid,
            item.refinvid,
            item.fullname,
            item.vehtype,
            item.phone,
            item.amount,
            item.paymentdate,
            item.paytype,
            item.isreceived === 0 ? 'Failure' : 'Success'
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

        doc.save(`Payment_Details_${fileNameDate}.pdf`);

        this.pdfProgress = 100;
        this.pdfStatus = 'Download started';

        setTimeout(() => {
          this.isPdfGenerating = false;
        }, 500);

      }, 200);

    }, 50);
  }
}