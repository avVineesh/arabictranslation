import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AttendanceregisterService } from './attendanceregister.service';
@Component({
  selector: 'app-attendanceregister',
  standalone: true,
  imports: [
     CommonModule,
            NgbCarouselModule,
            FormsModule,
            HttpClientModule,
            NgxSpinnerModule,
            SharedModule,
            RouterModule
  ],
  templateUrl: './attendanceregister.component.html',
  styleUrl: './attendanceregister.component.scss'
})
export default class AttendanceregisterComponent implements OnInit {
 itemslist: any;
  parkingspacelist: any;
  resLength: string;
  orglist: any;
  isorg: number = 1;
  callfunction = 0;
  nameArray: any;
  orgname: string;
   filteroption:any;
   date:any;
  todate:any;
  staffsttendance: any;
  constructor(public service: AttendanceregisterService,public toaster: ToastrService, public router: Router,public spinner:NgxSpinnerService,){
  }
  ngOnInit() {
     this.date = ''
    this.todate=''
       this.nameArray = [];
      this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
      this.service.id = JSON.parse(localStorage.getItem('orgid'));
      //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
      this.service.isorg = 1;
      this.orgname = localStorage.getItem('orgname');
      this.getParkingspaceList();
      this.getOrgList();
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
        this.getAttendanceReg();
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
    getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
    DataTable() { // function for creating  datatable 
       
        $('#mytable').DataTable().destroy();
    
      const currentDateTime = this.getCurrentDateTime();
      const from = this.date;
      const to =this.todate;
      $(document).ready(function () {
        var table = $('#mytable').DataTable({
          dom: "Bfrtip",
          buttons: [
            {
              extend: 'pdfHtml5',
              text: 'PDF',
              title: 'Attendance Register',
              messageTop: `Report generated Date & Time: ${currentDateTime},
                           Filtered From: ${from}, To: ${to}`,
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
                      text: 'Attendance Register',
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
              title: 'Attendance Register',
              messageTop: `Report generated Date & Time: ${currentDateTime}, 
                           Filtered From: ${from}, To: ${to}`,
              exportOptions: {
                modifier: { page: 'all' }
              }
            }
          ]
        });
    
        table.draw();
      });
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
  getAttendanceReg(){
     this.service.date=this.date;
    this.service.todate=this.todate;
     this.spinner.show();
    this.service.getAttendance().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode=='4500'){
        if(Response["Response"][1].length!=0){
          this.staffsttendance = Response["Response"][1];
          this.spinner.hide();
          this.DataTable();
        }else{
          this.toaster.info("So far no Payment available!");
          this.staffsttendance=[];
          this.DataTable();
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
    });
  }
   parkispaceFilter(event:any){
      this.service.id=event.target.value;
      this.service.isorg=0;
      this.service.isendpoint=1;
      this.getAttendanceReg();
  }
}
