import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { AssetsService } from './assets.service';
interface ReportRow {
  parking_lot_name: string;
  month: string;
  uptime: number;
  downtime: number;
}
@Component({
  selector: 'app-assets',
  standalone: true,
  providers: [DatePipe],
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export default class AssetsComponent implements OnInit {
  itemslist: any;
  parkingspacelist: any;
  resLength: string;
  orglist: any;
  isorg: number = 1;
  callfunction = 0;
  nameArray: any;
  orgname: string;
  assets: any;
  editassets: any[];
  date: any;
  todate: any;
  summarydata: any;
  showTable = false;
  summarytable: number = 0;
  rawData: ReportRow[] = [];
  months: string[] = [];
  tableData: any[] = [];
  time: any;
  myDate: any;
  today: string;
  constructor(public service: AssetsService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService, public modalService: NgbModal, public datepipe: DatePipe, public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
    this.nameArray = [];
    this.summarytable = 0
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.date = ''
    this.todate = ''
    this.getOrgList();
    this.getItemListanParkingSpace();
    this.resetform();
  }
  addAsset(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  summary(sum: ElementRef) {
    this.modalService.open(sum, { size: 'md' });
  }
  editAssets(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.assetdata = {
      token: "",
      serialnumber: "",
      devicetype: "",
      specification: "",
      parking_lot_id: "",
      status: "",
      lat: "",
      lng: "",
      createddate: "",
      id: "",
      ip: ""
    },
      this.date = "",
      this.todate = ""
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
      this.getDetails()
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
  getItemListanParkingSpace() {
    this.service.getItemsList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '10') {
        this.itemslist = Response["Response"][1];
        this.parkingspacelist = Response["Response"][2];
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
  saveData() {
    this.service.saveAssets().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"]
      if (logcode == '20') {
        this.toaster.success("Added Successfully");
        this.getDetails();
        this.resetform();
      } else if (logcode == '22') {
        this.toaster.warning("Serial Number already exist")
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
  getDetails() {
    this.summarytable = 0;
    this.spinner.show();
    this.service.getAssetDetails().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      let length = Response["Response"][1].length
      if (logcode == '30') {
        if (length != 0) {
          this.assets = Response["Response"][1];
          this.datatable();
          this.spinner.hide();
        } else {
          this.toaster.info("No Items Added");
          this.assets = [];
          this.datatable();
          this.spinner.hide();
        }
      } else {
        this.spinner.hide();
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  }
  datatable() {
    $('#mytable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable').DataTable({
        "ordering": false,
        pageLength: 15
      });
      table.draw();
    });
  }
  getIndex(i: any) {
    this.editassets = Array(this.assets[i]);

  }
  editDetails(editdata: any) {
    this.service.edit(editdata).subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"]
      if (logcode == '40') {
        this.toaster.success("Updated Successfully");
        this.getDetails();
        this.resetform();
      } else if (logcode == '42') {
        this.toaster.warning("Serial Number already exist")
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
  getSummary() {
    this.rawData = [];
    this.months = [];
    this.summarytable = 1
    this.spinner.show();
    this.service.date = this.date;
    this.service.todate = this.todate;
    this.service.assetsActiveSummary().subscribe((Response) => {
      console.log(Response)
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '40') {
        if (Response["Response"][1].length != 0) {
          this.rawData = Response["Response"][1];
         this.months = Array.from(
    new Set(this.rawData.map(r => r.month))
).sort((a, b) => {
    // a, b are like '2026-January', '2026-February'
    const [yearA, monthNameA] = a.split('-');
    const [yearB, monthNameB] = b.split('-');
    const dateA = new Date(`${monthNameA} 01 ${yearA}`).getTime();
    const dateB = new Date(`${monthNameB} 01 ${yearB}`).getTime();
    return dateA - dateB;
});
          this.buildTable()
          this.showTable = true;
          this.cdr.detectChanges();

          this.datatable1();
          //  this.datatable1();
          this.spinner.hide();
        } else {
          this.toaster.info("No data Available!");
          this.rawData = [];
          this.spinner.hide();
        }
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


  buildTable() {
    this.tableData = [];
    const map: any = {};

    this.rawData.forEach(row => {
      if (!map[row.parking_lot_name]) {
        map[row.parking_lot_name] = {
          parking_lot_name: row.parking_lot_name,
          uptime: {},
          downtime: {}
        };
      }

      map[row.parking_lot_name].uptime[row.month] = row.uptime;
      map[row.parking_lot_name].downtime[row.month] = row.downtime;
    });
    this.tableData = Object.values(map);

  }


  getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  datatable1() {

    const tableElement = $('#mytable1');
    tableElement.DataTable().destroy();
    const currentDateTime = this.getCurrentDateTime();
   const date =this.datepipe.transform(this.service.date,'dd-MM-yyyy')
  const todate=this.datepipe.transform(this.service.todate,'dd-MM-yyyy')


    setTimeout(() => {
      const table = tableElement.DataTable({
        ordering: false,
        pageLength: 10,
        dom: 'Bfrtip',

        buttons: [
          {
            extend: 'pdfHtml5',
            text: 'PDF',
            title: `System Uptime Availability Report SPMS :${date} -${todate}`,
            messageTop: `Report generated Date & Time: ${currentDateTime}`,
            orientation: 'landscape',
            pageSize: 'A4',

            customize: (doc: any) => {
              // Page setup
              doc.pageMargins = [20, 60, 20, 40];

              // Watermark
              doc.watermark = {
                text: 'ELVICTO TECHNOLOGIES',
                color: 'blue',
                opacity: 0.08,
                bold: true,
                fontSize: 40
              };

              // Header
              doc.header = {
                columns: [
                  {
                    text: `System Uptime Availability Report SPMS`,
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
              doc.footer = (currentPage, pageCount) => ({
                columns: [
                  {
                    text: `Page ${currentPage} of ${pageCount}`,
                    alignment: 'center',
                    fontSize: 9
                  }
                ],
                margin: [0, 0, 0, 10]
              });

              // Auto column width
              const tableNode = doc.content.find((c: any) => c.table);
              if (tableNode?.table?.body?.length) {
                const colCount = tableNode.table.body[0].length;
                tableNode.table.widths = Array(colCount).fill('*');
              }

              // Styling
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
            extend: 'excelHtml5',
            text: 'EXCEL',
            title: `System Uptime Availability Report SPMS :${date} -${todate}`,
            messageTop: `Report generated Date & Time: ${currentDateTime}`,
            exportOptions: {
              modifier: { page: 'all' }
            }
          }
        ]
      });

      table.draw();
    }, 0);
  }






}
