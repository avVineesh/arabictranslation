import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { UpdateModal } from './monthlypass.modal';
import { ParkingareareportService } from '../../analytics/parkingareareport/parkingareareport.service';
import { MonthlypassService } from './monthlypass.service';
import { VehiclecategoryService } from '../../adminsettings/vehiclecategory/vehiclecategory.service';
@Component({
  selector: 'app-monthlypass',
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
  templateUrl: './monthlypass.component.html',
  styleUrl: './monthlypass.component.scss'
})
export default class MonthlypassComponent implements OnInit {
  datas: any;
  logcode: any;
  VehType: any;
  vehicletype: any;
  value: any;
  monthtraiff: any[];
  unitvalues: any;
  values1: any;
  unitvalueview: any;
  logcode1: any;
  MPassDetails: any;
  veh: any;
  vtype: any;
  ChangedPrice: any;
  count: number = 0;
  count1: number = 0;
  MPindex: any[];
  updatelogcode: any;
  myDate: any;
  ownusers: any;
  selectedetails: any[];
  buutonvalue: number;
  vehdetails: any;
  vehnumbers = new Array();
  viewmonthlypass: number;
  viewcustompass: number;
  daytariff: any[];
  dayvehtype: any;
  dayunit: any;
  monthview: number;
  dayview: number;
  isorg: number = 1;
  callfunction = 0;
  orgid: any;
  resLength: any;
  orgname: string;
  nameArray: any[]=[];
  orglist: any;
  filteroption:any;
  parkingspacelist: any;
  date:any;
  todate:any;
  selecttype:any;
  constructor(public arealistservice: ParkingareareportService,
    public toastr: ToastrService,
    public router: Router,
    public VehicleType: VehiclecategoryService,
    public service: MonthlypassService,
    public datepipe: DatePipe,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal
    // public custservice: CustomerdetailsService,
    // public custvehservice: VehicledetailsService
  ) { }

  ngOnInit() {
    this.onGetParkingList();
    // this.getOwnCustomerDetails();
    // this.OnGetVehicleType();
    
    this.resetform();
    this.service.feeStructure.userid = "";
    this.service.feeStructure.parking_lot_id = "";
    this.date = ''
    this.todate=''
    this.service.type='';
    this.datas = "";
    this.vehnumbers = [];
    this.nameArray = [];
    this.getParkingspaceList();
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
  }
  addPass(add: ElementRef) {
    this.modalService.open(add, { size: 'lg' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.feeStructure = {
      token: "",
      parking_lot_id: "",
      vehicletype: "",
      vehiclenumber: "",
      fullname: "",
      phonenumber: "",
      month: "",
      fees: "",
      unit: "",
      passnumber: "",
      fromdate: "",
      userid: "",
      todate: ""
    }
    this.selecttype='0'
  }
  OnReset() {
    this.resetform();
    this.vehicletype = [];
    this.unitvalues = [];
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
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    this.onGet();
      
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
  onGetParkingList() {
    this.arealistservice.GetParkingAreaList()
      .subscribe((Response) => {
        this.datas = Response["Response"][1];
        this.logcode = Response["Response"][0][0]["_logcode"];
        if (this.logcode == '1491') {
          this.toastr.error("Token Expired");
          localStorage.removeItem("access_token");
          this.router.navigate(['login']);
        }
      });
  }
  OnGetVehicleType() {

    this.VehicleType.GetVehicleCateory().subscribe((Response) => {
      this.VehType = Response["Response"][1];
    });
  }
  onGetFeeStructure(event: any) {
    this.service.feeStructure.parking_lot_id = event.target.value;
    this.service.GetFeeDetails().subscribe((Response) => {
      if (Response["monthtariff"] == '') {
        this.toastr.info("Monthly Pass not available for this parkingspace!");
      }
      this.monthtraiff = Array(Response["monthtariff"]);
      this.vehicletype = Response["vehtype"];
    });
  }
  vGetFeeStructure(data: any) {
    console.log(data.target.value);
    this.value = data.target.value;
    for (let i = 0; i < this.monthtraiff.length; i++) {
      this.unitvalues = this.monthtraiff[i][this.value];
      if (this.unitvalues == '' || this.unitvalues == undefined) {
        this.toastr.info("Monthly Pass is not available for this vehicle!");
      }
      if (this.count1 != 0) {
        this.ChangedPrice = this.monthtraiff[i][this.value]["units"][this.vtype - 1]["price"];
        this.count1 = 0;
      }
    }
    this.count = 1;
    this.count1 = 1;
    if (this.count != 0) {
      this.service.feeStructure.fees = this.ChangedPrice;
    }
    this.count = 0;


  }


  GetFeeStructurevalue(event: any) {
    this.vtype = event.target.value;
    this.service.feeStructure.fees = this.unitvalues["units"][event.target.value - 1]["price"];
  }



  SaveMonthPass() {//function for adding a new monthly pass
    if (this.viewcustompass != 1 && this.viewmonthlypass != 1) {
      this.toastr.warning("Please select a Pass type");
    }
    if (this.viewcustompass == 1) {
      if (this.service.feeStructure.fromdate == '') {
        this.toastr.warning("Please enter a startdate");
      } else if (this.service.feeStructure.todate == '') {
        this.toastr.warning("Please enter a valid enddate")
      } else {
        this.service.addCustompass().subscribe((Response) => {
          let customlog = Response["Response"][0][0]["_logcode"];
          if (customlog == '2420') {
            this.toastr.success("Pass created");
            $('#mytable').DataTable().destroy();
            this.onGet();
          } else if (customlog == '2422') {
            this.toastr.warning("pass already exist!");
          } else {
            this.toastr.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
        });
        this.resetform();
        this.vehicletype = [];
        this.unitvalues = [];
      }

    }
    if (this.viewmonthlypass == 1) {
      if (this.service.feeStructure.fromdate == '') {
        this.toastr.warning("Please enter a startdate");
      } else if (this.service.feeStructure.parking_lot_id == '') {
        this.toastr.warning("Please select a parking space");
      } else if (this.service.feeStructure.vehicletype == '') {
        this.toastr.warning("Please select a vehicle type");
      } else if (this.service.feeStructure.month == '') {
        this.toastr.warning("Please select number of month");
      } else {
        this.service.AddMonthlyPass()
          .subscribe((response) => {
            this.logcode = response["Response"][0][0]["_logcode"];
            if (this.logcode == '1690') {
              this.toastr.success("Pass Created");
              $('#mytable').DataTable().destroy();
              this.onGet();

            } else if (this.logcode == '1692') {
              this.toastr.warning("Vehicle/Pass ID Already Exists");
            }
            else {
              this.toastr.error("Session Timeout");
              localStorage.removeItem("access_token");
              localStorage.removeItem("orgid");
              localStorage.removeItem("Role");
              localStorage.removeItem("logcode");
              localStorage.removeItem("logcode1");
            }
          });
        this.resetform();
        this.vehicletype = [];
        this.unitvalues = [];
      }
    }


  }
  onGet() {
    this.spinner.show();
     this.service.date=this.date;
    this.service.todate=this.todate;
    this.service.GetMonthlyPass().subscribe((Response) => {
      this.logcode1 = Response["Response"][0][0]["_logcode"];
      if (this.logcode1 == '1670') {
        if(Response["Response"][1].length!=0){
           this.MPassDetails = Response["Response"][1];
       this.DataTable();
        this.spinner.hide();
        }else{
           this.toastr.info("No Pass Details!");
          this.MPassDetails=[];
          this.DataTable();
          this.spinner.hide();
        }
      
      } else {
         this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
        this.spinner.hide();
      }
    });
  }
  GetvalueIndex(i: any) {
    this.MPindex = Array(this.MPassDetails[i]);
    this.MPindex['parking_lot_id']
    this.service.monthedit = Array(this.MPassDetails[i]);
    // let myvar=JSON.parse(this.roleindex[0]["privileges"]);
    // this.RolePrivData.Privilege.Privileges=myvar.Privileges;
  }

  // Update Monthly Pass Details
  onUpdate(data: UpdateModal) {
    this.service.UpdateMonthlyPass(data).subscribe((Response) => {
      this.updatelogcode = Response["Response"][0][0]["_logcode"];
      if (this.updatelogcode == '1700') {
        this.toastr.success("Updated Successfully");
        $('#mytable').DataTable().destroy();
        this.onGet();

      } else if (this.updatelogcode == '1701') {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {

        this.toastr.warning("Can't Able to Connect");
      });
  }
  dateFormat() {                 // function for disabling past date from the datepicker
    this.myDate = new Date();
    this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  // getOwnCustomerDetails() {
  //   this.custservice.getOwnUsers().subscribe((Response) => {
  //     this.ownusers = Response["Response"][3];
  //   });
  // }
  getSelectedCustomerDetails(event: any) {
    this.service.feeStructure.userid = event.target.value;
    for (var i = 0; i < this.ownusers.length; i++) {
      if (this.ownusers[i]["custid"] == event.target.value) {
        this.service.feeStructure.phonenumber = this.ownusers[i]["phone"];
        this.service.feeStructure.fullname = this.ownusers[i]["fullname"];
      }
    }
    // this.custvehservice.custid = event.target.value;
    // this.getVehicleDetails();
  }
  // getVehicleDetails() {
  //   this.custvehservice.GetVehicleDetails().subscribe((Response) => {
  //     this.vehdetails = Response["Response"][1]
  //   });
  // }
  vehicleNumberSelect(event: any) {
    console.log("Reached!!!");
    this.vehnumbers = [];
    for (let i = 0; i < this.vehdetails.length; i++) {
      if (this.vehdetails[i]["vehicletype"] == event.target.value) {
        this.vehnumbers.push(this.vehdetails[i]);
      }
    }
  }
  trigerMonthlyPass() {
    // if (this.monthtraiff == []) {
    //   this.toastr.info("Monthly Pass not available!");
    // }
    this.service.feeStructure.fees = '';
    this.service.feeStructure.fromdate = '';
    this.service.feeStructure.todate = '';
    this.viewmonthlypass = 1;
    this.viewcustompass = 0;
  }
  trigerCustomPass() {
    // if (this.daytariff == []) {
    //   this.toastr.info("Day pass is not available!");
    // }
    this.service.feeStructure.fees = '';
    this.service.feeStructure.fromdate = '';
    this.service.feeStructure.todate = '';
    this.viewcustompass = 1;
    this.viewmonthlypass = 0;
  }
  getDayTariff(event: any) {  //api call for getting day tariff for the selected parkingspace...............
    this.service.feeStructure.parking_lot_id = event.target.value;
    this.service.getDayTariff().subscribe((Response) => {
      this.daytariff = Array(Response["daytariff"]);
      this.dayvehtype = Response["vehtype"];
    });
  }
  getDayVehFeeStructure(event: any) { //function for selection the units value for the vehicle type.................
    try {
      let vehtype = event.target.value;
      for (let i = 0; i < this.daytariff.length; i++) {
        this.dayunit = this.daytariff[i][vehtype]["units"];
      }
    } catch (error) {
      this.toastr.warning("daily tariff not available!");
    }

  }
  dayValueCalculation() { // function for chhosing the price for the day interval
    let fromdate = new Date(this.service.feeStructure.fromdate);
    let todate = new Date(this.service.feeStructure.todate);
    let daydiff = Math.floor((Date.UTC(todate.getFullYear(), todate.getMonth(), todate.getDate()) - Date.UTC(fromdate.getFullYear(), fromdate.getMonth(), fromdate.getDate())) / (1000 * 60 * 60 * 24));
    for (let i = 0; i < this.dayunit.length; i++) {
      if (daydiff > this.dayunit[i]["unitstart"] && daydiff <= this.dayunit[i]["unitend"]) {
        this.service.feeStructure.fees = this.dayunit[i]["price"];
      }
    }
  }
  getParkingspaceList(){
    this.service.getParkingspacelist().subscribe((Response)=>{
      let logcode=Response["Response"][0][0]["_logcode"];
      if(logcode='1490'){
        this.parkingspacelist=Response["Response"][1];
      }else{
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  }
  getPassType(event:any){
    this.service.type=event.target.value;
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  DataTable() { // function for creating  datatable 
   
    $('#mytable').DataTable().destroy();

  const currentDateTime = this.getCurrentDateTime();
  const from= this.date;
  const to = this.todate;
  $(document).ready(function () {
    var table = $('#mytable').DataTable({
      dom: "Bfrtip",
      buttons: [
        {
          extend: 'pdfHtml5',
          text: 'PDF',
          title: 'Pass Details',
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
                  text: 'Pass Details',
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
          title: 'Pass Details',
          messageTop: `Report generated Date & Time: ${currentDateTime} , 
                       Filtered From: ${from} To: ${to}`,
          exportOptions: {
            modifier: { page: 'all' }
          }
        }
      ]
    });

    table.draw();
  });
  }
  parkispaceFilter(event:any){
      this.service.id=event.target.value;
      this.service.isorg=0;
      this.service.isendpoint=1;
    this.onGet();
  }

}
