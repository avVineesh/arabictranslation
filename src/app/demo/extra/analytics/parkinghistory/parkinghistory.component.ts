import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbAccordionModule, NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { ParkinghistoryService } from './parkinghistory.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-parkinghistory',
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
  providers:[DatePipe],
  templateUrl: './parkinghistory.component.html',
  styleUrl: './parkinghistory.component.scss'
})
export default class  ParkinghistoryComponent implements OnInit {
   date:any;
  todate:any;
  total: any=0;
  isorg: number = 1;
  callfunction = 0;
  orgid: any;
  contactnumber:any;
  resLength: any;
  orgname: any;
  nameArray: any[]=[];
  orglist: any;
  parkingspacelist: any;
  vehnumber:any;
   filteroption:any;
    totalentry: any;
  totalexit: any;
  showoption: boolean;
  historydata: any;
  showtaable: number;
  constructor(public service:ParkinghistoryService, public toaster: ToastrService, public router: Router,
      public spinner:NgxSpinnerService,public datepipe:DatePipe,public modalService: NgbModal,public sanitizer: DomSanitizer) { }
ngOnInit() {
   this.date = ''
    this.todate=''
    this.service.status='3';
    this.service.mode='0';
    this.nameArray = [];
    this.getParkingspaceList();
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
    this.showtaable=0;
}
 columnOptions = [
    { label: 'Parking Space Name', selected: true },
    { label: 'Entry Type', selected: true },
    { label: 'Vehicle Type', selected: true },
    { label: 'Vehicle Number', selected: true },
    { label: 'Customer type', selected: true },
    { label: 'Owner Phone Number', selected: true },
    { label: 'Start Date', selected: true },
    { label: 'End Date', selected: true },
    { label: 'Amount', selected: true }
  ];
 toogleOptions(){
    if(this.showoption){
      this.showoption=false
    }else{
      this.showoption=true
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
  }
  get selectedColumnIndexes(): number[] {
    return this.columnOptions
      .map((col, i) => col.selected ? i : -1)
      .filter(i => i !== -1);
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
  ngAfterViewInit() {
    this.DataTable();
  }

  onColumnChange() {
    // 
    this.DataTable();
  }
  getParkingHistory(){
    this.showtaable=0;
    this.spinner.show();
     $('#mytable').DataTable().destroy();
    this.service.date=this.date;
    this.service.todate =this.todate;
    this.service.vehno=this.vehnumber;
    this.historydata=[];
    if(this.vehnumber=='' || this.vehnumber==null){
      this.toaster.info("Please Enter the vehicle Number to Search")
      this.spinner.hide();
    }else{
        this.service.getHistory().subscribe((Response)=>{
    let logcode= Response["Response"][0][0]["_logcode"];
    if(logcode=='6890'){
      if( Response["Response"][1].length!=0){
        this.showtaable=1;
          this.historydata = Response["Response"][1];
          this.DataTable();
      }else{
        this.toaster.info("Parking History Not Available!");
        this.DataTable();
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
  }
 getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  DataTable() { // function for creating  datatable 
   
    $('#mytable').DataTable().destroy();

  const currentDateTime = this.getCurrentDateTime();
  const from =this.date;
  const to = this.todate;
  $(document).ready(()=> {
    var table = $('#mytable').DataTable({
      dom: "Bfrtip",
      ordering: false,
      columnDefs: this.columnOptions.map((col, i) => ({
        targets: i,
        visible: col.selected
      })),
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
      buttons: [
      {
  extend: 'pdfHtml5',
  text: 'PDF',
  title: 'Parking History',

  exportOptions: {
    columns: ':visible'
  },

  messageTop: `Report generated Date & Time: ${currentDateTime},`,

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
          title: 'Parking History',
          messageTop: `Report generated Date & Time: ${currentDateTime},
                Filtered From : ${from} To: ${to}`,
          exportOptions: { columns: this.selectedColumnIndexes }
        }
      ]
    });

    table.draw();
  });
  this.spinner.hide();
  }
}
