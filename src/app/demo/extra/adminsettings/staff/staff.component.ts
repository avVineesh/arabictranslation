import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { StaffService } from './staff.service';
import { RoleService } from '../role/role.service';
import { Saffmodel, StaffPriv, StaffStatusCheck } from './staff.modal';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgxSpinnerModule,
    SharedModule
  ],
  providers:[DatePipe],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export default class StaffComponent implements OnInit {
  stafflist: Saffmodel[];
  staffdata: Saffmodel;
  logcode: any;
  staffindex: Saffmodel[];
  rolelist: any;
  code: any;
  dtExportButtonOptions: any = {};
  staffname: any;
  logcode1: string;
  StaffPri: Saffmodel[];
  StaffPriData: StaffPriv;
  Staff: StaffPriv;
  StaffID: string;
  count: string;
  count1: string;
  ActiveRole: any[];
  hierarchytype: any;
  organizations: any[];
  organizationlist: any;
  list: any[];
  droplist: any;
  filterlogcode: any;
  myDate: any;
  minDate: any;
  constructor(public SService: StaffService, public toaster: ToastrService, public roleservice: RoleService, public router: Router,
    public datepipe: DatePipe, public spinner:NgxSpinnerService,public modalService: NgbModal){
  }
  ngOnInit() {
    this.onGet();
    this.resetform();
    this.OnGetRole();
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
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.SService.staffdata = {
      fullname: '',
      id: '',
      rolename: '',
      roleid: '',
      type: '',
      phone: '',
      Active: '',
      parking_lot_name: '',
      staffid: '',
      password: '',
      orgid: "",
      parking_lots_id: "",
      token: "",
      staffcode: '',
      todate: '',
      email: '',
      isactive: '',
      otp: '',
      repstaffname: '',
      mobileuser: '',
      reportingstaffid: '',
      parentid: "",
      hierarchytype: "",
    }
    this.StaffPriData = {
      Token: '',
      StaffId: '',
      Privilege: {
        Privileges:
          [{
            Analytics:
            {
              ParkingAreaReport: {
                View: false,
                Edit: false,
                Create: false
              },
              // Revenue:{
              //   View:'',
              //   Edit:'',
              //   Create:''
              // },
              Occupancy: {
                View: false,
                Edit: false,
                Create: false
              },
              ParkedVehicle: {
                View: false,
                Edit: false,
                Create: false
              },
              Summary: {
                View: false,
                Edit: false,
                Create: false
              },
              customreport:{
                View: false,
                Edit: false,
                Create: false
              },
              customanalytics:{
                View: false,
                Edit: false,
                Create: false
              },
               parkinghistory:{
                View: false,
                Edit: false,
                Create: false
              }
            },
            Finanace:
            {
              Paymentlog: {
                View: false,
                Edit: false,
                Create: false
              },
              Refunds: {
                View: false,
                Edit: false,
                Create: false
              },
              Reconciliation: {
                View: false,
                Edit: false,
                Create: false
              }
            },
            Management:
            {

              LiveView: {
                View: false,
                Edit: false,
                Create: false
              },
              Vehicles: {
                View: false,
                Edit: false,
                Create: false
              },
              CustomerDet: {
                View: false,
                Edit: false,
                Create: false
              },
              MonthlyPass: {
                View: false,
                Edit: false,
                Create: false
              },
              BookingDetails: {
                View: false,
                Edit: false,
                Create: false
              },
              FasTagdetails: {
                View: false,
                Edit: false,
                Create: false
              },
              NetworkMonitor: {
                View: false,
                Edit: false,
                Create: false
              },
              servicemonitor: {
                View: false,
                Edit: false,
                Create: false
              },
              boombarrierlog: {
                View: false,
                Edit: false,
                Create: false
              },
              valetdetails: {
                View: false,
                Edit: false,
                Create: false
              },
              employeetag: {
                View: false,
                Edit: false,
                Create: false
              },
              attendanceregister: {
                View: false,
                Edit: false,
                Create: false
              },
              blacklistedvehicles:{
                View: false,
                Edit: false,
                Create: false
              },
              assets:{
                View: false,
                Edit: false,
                Create: false
              }
            },
            ParkingSetting:
            {
              ParkingLots: {
                View: false,
                Edit: false,
                Create: false
              },
              ParkingSpace: {
                View: false,
                Edit: false,
                Create: false
              },
              boombarrier: {
                View: false,
                Edit: false,
                Create: false
              },
              sensor: {
                View: false,
                Edit: false,
                Create: false
              },
              display: {
                View: false,
                Edit: false,
                Create: false
              },
              posdevices: {
                View: false,
                Edit: false,
                Create: false
              },
              rfreaders: {
                View: false,
                Edit: false,
                Create: false
              }

            },
            AdminSetting:
            {
              OrgProf:
              {
                View: false,
                Edit: false,
                Create: false

              },
              Role: {
                View: false,
                Edit: false,
                Create: false
              },
              Staff: {
                View: false,
                Edit: false,
                Create: false
              },
              Tariff: {
                View: false,
                Edit: false,
                Create: false
              },
              OrgType: {
                View: false,
                Edit: false,
                Create: false
              },
              orgfunctionalmap:{
                View:false,
                Edit:false,
                Create:false
              },
              orgdomain:{
                View:false,
                Edit:false,
                Create:false
              }
            },
            MobilePrivileges:
            {
              fullsummary:
              {
                View: false,
                Edit: false,
                Create: false
              },
              analytics:
              {
                View: false,
                Edit: false,
                Create: false
              }
            }

          }]

      }

    }
  }
  addModal(addstaff: ElementRef) {
    this.modalService.open(addstaff, { size: 'lg' });
  }
  editModal(editrole: ElementRef) {
    this.modalService.open(editrole, { size: 'lg' });
  }
  privModal(addpriv: ElementRef) {
    this.modalService.open(addpriv, { size: 'md' });
  }
  onGet() {   // Retrieving saved staff details
    this.spinner.show();
    this.SService.GetData().subscribe((Response: Saffmodel[]) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      this.staffname = Response["Response"][6];
      this.stafflist = Response["Response"][1];
      this.spinner.hide();
      this.droplist = Response["Response"][1];
      this.ActiveRole = Response["Response"][3];
      this.hierarchytype = Response["Response"][4];
      this.organizationlist = Response["Response"][5];
      // this.dtTrigger.next();

      if (this.logcode == '1091') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
        this.spinner.hide();
      } else {
        $(document).ready(function () {
          var table = $('#mytable').DataTable();
          table.draw();
        });
      }



    });
  }
  OnReset() {
    this.resetform();
  }

  OnGetRole() {   //Function for retrieving role
    this.roleservice.GetUserRole().subscribe((Response: Saffmodel[]) => {
      this.rolelist = Response["Response"][1];
    });
  }

  StatusCheck1(stafflist1: StaffStatusCheck) {  //Function for changing the Staff Status 
    stafflist1.staffid = stafflist1.staffid;
    if (stafflist1.isactive == '1') {
      stafflist1.isactive = '0';
      this.count = "1";
    }
    else {
      this.count = "2";
      stafflist1.isactive = '1';
    }

    this.SService.StaffStatus(stafflist1).subscribe((result) => {
      this.logcode = result["Response"][0][0]["_logcode"]
      if (this.logcode == '1110') {

        if (this.logcode == '1110' && this.count == '1') {
          this.toaster.success("Status Deactivated");
        }
        else if (this.logcode == '1110' && this.count == '2') {
          this.toaster.success("Status Activated");
        }


      }
      else if (this.logcode1 == '1111') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {
        // this.toastrservice.Warning("Can't Able to Connect");
      });
  }


  MobileStatusCheck(stafflist1: Saffmodel) {   //function for changing the mobile status
    if (stafflist1.mobileuser == '1') {
      stafflist1.mobileuser = '0';
      this.count1 = "1";
    }
    else {
      this.count1 = "2";
      stafflist1.mobileuser = '1';
    }

    this.SService.StaffMobileStatus(stafflist1).subscribe((result) => {

      this.logcode = result["Response"][0][0]["_logcode"];
      if (this.logcode == '1620') {

        if (this.logcode == '1620' && this.count1 == '1') {
          this.toaster.warning("DeActivated");
        }
        else if (this.logcode == '1620' && this.count1 == '2') {
          this.toaster.success("Activated As Mobile User");
        }


      }
      else if (this.logcode == '1621') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {
        this.toaster.warning("Can't Able  Connect with Server");
      });
  }

  GetValueIndex(i: any) {  //function for getting index of a particular staff details
    this.staffindex = Array(this.stafflist[i]);
    this.StaffPri = Array(this.stafflist[i]);
    this.StaffID = this.StaffPri[0]["staffid"];
    let myvar = JSON.parse(this.staffindex[0]["privileges"]);
    if (myvar == null || myvar == "") {
      this.resetform();
    }
    else {
      this.StaffPriData.Privilege.Privileges = myvar.Privileges;
    }
  }

  OnAddStaff() {    //function for adding a new staff
    if (this.SService.staffdata.mobileuser == true) {
      this.SService.staffdata.mobileuser = "1";
    }
    else if (this.SService.staffdata.mobileuser == false) {
      this.SService.staffdata.mobileuser = "0";
    }
    this.SService.AddStaffservice().subscribe((result) => {
      this.logcode = result["Response"][0][0]["_logcode"]

      if (this.logcode == '1100') {
        this.toaster.success("Staff Created");
        $('#mytable').DataTable().destroy();
        this.onGet();

      }
      else if (this.logcode == "1102") {
        this.toaster.warning("Staff ID Already Exist");
      }
      else if(this.logcode=="1103"){
        this.toaster.warning("Staff already exist with same phone number!");

      }
      else if (this.logcode1 == '1101') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {
        this.toaster.warning("Can't Able  Connect with Server");

      }
    );
    this.resetform();
  }

  OnUpdate(staffindex: Saffmodel) {  //function for editing the staff details
    staffindex.id = staffindex.staffid;

    this.SService.OnUpdateSer(staffindex).subscribe((result) => {
      console.log(result)
      this.logcode = result["Response"][0][0]["_logcode"]
      if (this.logcode == '1630') {
        this.toaster.success("Staff Updated");
        // this.rerender();
        $('#mytable').DataTable().destroy();
        this.onGet();

      }
      else if (this.logcode1 == '1631') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {

        this.toaster.warning("Can't Able to Connect");
      });

  }

  AddPrivil(StaffPriData: StaffPriv) {  //function for adding privilege for a  particular staff 
    StaffPriData.StaffId = this.StaffID;
    this.SService.AddStaffPriv(StaffPriData).subscribe((Response) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == '1580') {
        this.toaster.success("Staff Privileges Successfully Added");
        $('#mytable').DataTable().destroy();
        this.onGet();
      }
      else if (this.logcode1 == '1581') {
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
  getOrganization(event: any) {
    this.organizations = [];
    this.list = [];
    var name = event.target.value;
    this.SService.hierarchyid = name;

    for (let i = 0; i < this.organizationlist.length; i++) {
      if (this.organizationlist[i]["hierarchy_type"] == name) {
        this.organizations.push(this.organizationlist[i]);
        this.list.push(this.organizationlist[i]);
      }

    }
  }
  getFilterOrg(event: any) {
    this.SService.orgid = event.target.value;

  }
  getStaffUnderOrgFilter() {
    this.SService.getStaffOrgid().subscribe((Response) => {
      this.filterlogcode = Response["Response"][0][0]["_logcode"];
      if (this.filterlogcode == "1870") {
        if (Response["Response"][1].length != 0) {
          this.stafflist = Response["Response"][1];
        } else {
          this.toaster.warning("No Staff Available");
          this.stafflist = [];
        }
        $('#mytable').DataTable().destroy();
        $(document).ready(function () {
          var table = $('#mytable').DataTable();
          table.draw();
        });
      }
    });

  }
  dateFormat() {                 // function for disabling past date from the datepicker
    this.myDate = new Date();
   
    this.myDate = this.datepipe.transform(this.myDate,'yyyy-MM-dd');
    this.minDate = new Date(this.myDate);
    
  }
}
