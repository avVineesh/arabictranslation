import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgbAccordionModule, NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from './role.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GetUserRole, Userrole, RolePriv } from './role.modal';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-role',
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
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export default class RoleComponent implements OnInit {
  datas: GetUserRole[];
  roleindex: GetUserRole[];
  RolePrivData: RolePriv;
  public logcode = '';
  logcode1: any;
  logcode2: any;
  count: string = '';
  pri: any;
  pr: any;
  RoleAdmin: any;
  panels = ['First', 'Second', 'Third'];
constructor(public service: RoleService, public toaster: ToastrService, public router: Router,
  public spinner: NgxSpinnerService,public modalService: NgbModal){}
  ngOnInit() {
    this.onGet();
    this.resetform();
  }
 
  addModal(addrole: ElementRef) {
    this.modalService.open(addrole, { size: 'md' });
  }
  editModal(editrole: ElementRef) {
    this.modalService.open(editrole, { size: 'md' });
  }
  privModal(addpriv: ElementRef) {
    this.modalService.open(addpriv, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.FormData = {
      rolename: "",
      roledesc: "",
      token: "",
      orgid: "",
    },

      this.RolePrivData = {
        Token: '',
        RoleId: '',
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
                customreport: {
                  View: false,
                  Edit: false,
                  Create: false
                },
                customanalytics: {
                  View: false,
                  Edit: false,
                  Create: false
                },
                 parkinghistory: {
                  View: false,
                  Edit: false,
                  Create: false
                },
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
                MonthlyPass: {
                  View: false,
                  Edit: false,
                  Create: false
                },
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
                orgfunctionalmap: {
                  View: false,
                  Edit: false,
                  Create: false
                },
                orgdomain:{
                  View: false,
                  Edit: false,
                  Create: false
                }
              },
              MobilePrivileges: {
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
  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }
  onSubmit(formData: Userrole) {  // Saving a new user role

    this.service.PostUserRole(formData)
      .subscribe((response) => {
        this.logcode = response["Response"][0][0]["_logcode"];
        if (this.logcode == '1080') {
          this.toaster.success("User Role Saved");
          this.onGet();
        } else if (this.logcode == '1082') {
          this.toaster.warning("Role Alredy Exist!");
        } else {
          this.toaster.error("Session Timeout");
        }
      });
    this.resetform();
  }

  onGet() {   // Get method for fetching the saved user role
    this.spinner.show();
    this.service.GetUserRole()
      .subscribe((Response: GetUserRole[]) => {
        this.datas = Response["Response"][1];
        this.spinner.hide();
        this.logcode2 = Response["Response"][0][0]["_logcode"];
        if (this.logcode2 == '1061') {
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


  GetvalueIndex(i: any) {

    this.roleindex = Array(this.datas[i]);
  }

  GetRolePriIndex(i: any) {

    this.roleindex = Array(this.datas[i]);
    let myvar = JSON.parse(this.roleindex[0]["privileges"]);
    if (myvar == null) {
      this.resetform();
    }
    else {
      this.RolePrivData.Privilege.Privileges = myvar.Privileges;
      this.RoleAdmin = myvar.Privileges[0];
    }

  }


  OnUpdate(roledetails: GetUserRole) {   // updating the user role


    this.service.OnUpdateRole(roledetails).subscribe((result) => {
      this.logcode = result["Response"][0][0]["_logcode"]
      if (this.logcode == '1080') {
        this.toaster.success("Updated Successfully");
        this.onGet();
      }
      else {
        this.toaster.error("Something Went Wrong");
      }
    },
      (erro: HttpErrorResponse) => {

        this.toaster.warning("Can't Able to Connect");
      });

  }



  changeStatus(userroledata: GetUserRole) {   // method for changing the status of a particular role
    if (userroledata.isactive == '1') {
      userroledata.isactive = '0';
      this.count = "1";
    }
    else {
      this.count = "2";
      userroledata.isactive = '1';
    }
    userroledata.token = JSON.parse(localStorage.getItem('access_token'));

    this.service.ChangeRoleStatus(userroledata).subscribe((response) => {
      this.logcode1 = response["Response"][0][0]["_logcode"];
      if (this.logcode1 == '1070') {
        if (this.logcode1 == '1070' && this.count == '1') {
          this.toaster.success("Status Deactivated");
        }
        else if (this.logcode1 == '1070' && this.count == '2') {
          this.toaster.success("Status Activated");
        }
      }
      else {
        this.toaster.error("Something Went Wrong:(");
      }
    });
  }
  AddPrivil(RolePrivData: RolePriv) {    //Method for adding privileges for a Particular role    
    this.RolePrivData.RoleId = this.roleindex[0]["roleid"];
    this.service.OnSaveRolePrivilege(RolePrivData).subscribe((response) => {
      this.logcode = response["Response"][0][0]["_logcode"];
      if (this.logcode == '1610') {
        this.toaster.success("Role Privileges Saved");
        this.onGet();
      } else if (this.logcode == '1611') {
        this.toaster.error("Role Privileges Not Saved");
      } else {
        this.toaster.error("Something Went Wrong With Server");
      }
    });
  }
  
}
