import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { ParkingareaService } from './parkingarea.service';
import { VehiclecategoryService } from '../../adminsettings/vehiclecategory/vehiclecategory.service';
import { Park, Parkingarea, StaffPark } from './parkingarea.modal';
import { finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ParkinglotsService } from '../parkinglots/parkinglots.service';
import * as AWS from 'aws-sdk';
@Component({
  selector: 'app-parkingarea',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    // SelectModule,
    // NgbButtonsModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    FormsModule,
    // TimePickerModule,
    NgxSpinnerModule,
    RouterModule
  ],
  providers:[DatePipe],
  templateUrl: './parkingarea.component.html',
  styleUrl: './parkingarea.component.scss'
})
export default class ParkingareaComponent implements OnInit {

  img: any;
  data1: any;
  buffervalue: any;
  fslots: any;
  // Main task 
  // task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;
  saveurl = [];
  // State for dropzone CSS toggling
  isHovering: boolean;
  files: File[] = [];
  logcode: any;
  ParkAreaData: Parkingarea[];
  ParkAreaEdit: Parkingarea;
  ParkAreaIndex: Parkingarea[];
  ParkAreaImage: Parkingarea[];
  logcode1: any;
  ParkAreaIndex1: Parkingarea[];
  value: any;
  ParkSetting: Parkingarea;
  VehType: any;
  custtype:any;
  parking: any;
  ParkSettingOnly: Parkingarea;
  Park: Parkingarea[];
  NewParkSetting: Parkingarea;
  ParkSettingAll: Park[];
  New: Park;
  logcode5: any;
  count: string = '';
  ParkVehicle: any;
  ParkType = [
    "Covered",
    "UnCovered"
  ];
  StaffName: { [key: string]: Object; }[] = [];
  StaffName1: Array<any>=[];
  value2: string[] = [];
  vehtypearray: string[];
  autoexittypearray: string[];
  customertypearray: string[];
  callCountFlag: boolean;
  StaffSpace: StaffPark;
  // maps the local data column to fields property
  public localFields: Object = { text: 'fullname', value: 'staffid' };
  // set the placeholder to MultiSelect Dropdown input element
  public localWaterMark: string = 'Select Staff';
  type: string;
  SParkAreaIndex: any[];
  staff: any[];
  parking_lot_id: any;
  parkstaff: string[] = [];
  parkstaff1: string[] = [];
  logunderme: any;
  undermeList: any;
  ParkLotsIndex: any[];
  ref: any;
  uploadProgress: any;
  url: any;
  tarifflistindex: any[];
  logtarifflist: any;
  tarifflist: any;
  viewflag: number;
  boombarrierlist: any;
  lotcount: any;
  buttonview: boolean;
  actualbufslot: any;
  actualfastslot: any;
  viewtariff:number;
  viewbb: number;
  displaylistdat: any;
  viewdisplay: number;
  callcustflag: boolean;
  staffcountflag: boolean;
  currentInput:any;
  disableddate:any;
  imageUrl: string = '';
  //selectedFile: File | null = null;
  selectedFiles: File[] = [];
  accesskeyid: string = '';
  secretaccesskey: string = '';
  bucketname: string = '';
   isorg: number = 1;
  callfunction = 0;
  orgid: any;
  resLength: any;
  orgname: string;
  nameArray: any[]=[];
  orglist: any;
  autoexittype: any;
  disableddates: any;
  viewdates: number;
  constructor(public PAreaSer: ParkingareaService, public toaster: ToastrService, public datepipe: DatePipe,
    public VehicleType: VehiclecategoryService, public router: Router, 
    public spinner: NgxSpinnerService,public modalService: NgbModal,public PLotservice:ParkinglotsService) { }
  ngOnInit() {
    this.resetform();
    this.OnGetVehicleType();
    this.OrgUnderMe();
    this.OnGetAwsSetting();
    this.callCountFlag = true;
    this.callcustflag = true;
    this.buttonview = true;
    this.nameArray = [];
    this.PAreaSer.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.PAreaSer.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.PAreaSer.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
  }
  getOrgList() {
    this.PAreaSer.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.PAreaSer.isendpoint = 1;
        this.PAreaSer.isorg = this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.PAreaSer.isendpoint = 0;
        this.PAreaSer.isorg = this.isorg;
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
     this.OnGetPSetting();
    });

  }
  selectEvent(event: any) {
    this.callfunction = 1;
    this.PAreaSer.orgid = event.target.value;
    this.PAreaSer.id = event.target.value;
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
    this.PAreaSer.orgid = data;
    this.PAreaSer.id = data;
    this.getOrgList();
    ;
  }
  addSpace(add: ElementRef) {
    this.modalService.open(add, { size: 'lg' });
  }
  editSpace(edit: ElementRef) {
    this.modalService.open(edit, { size: 'lg' });
  }
  openSettings(settings: ElementRef) {
    this.modalService.open(settings, { size: 'lg' });
  }
  tariffList(tariff: ElementRef) {
    this.modalService.open(tariff, { size: 'sm' });
  }
  boomList(boom: ElementRef) {
    this.modalService.open(boom, { size: 'sm' });
  }
   bookingDisable(bookingdis: ElementRef) {
    this.modalService.open(bookingdis, { size: 'sm' });
  }
  disList(dis: ElementRef) {
    this.modalService.open(dis, { size: 'sm' });
  }
  staffList(staff: ElementRef) {
    this.modalService.open(staff, { size: 'md' });
  }
  bankDetails(bank: ElementRef) {
    this.modalService.open(bank, { size: 'lg' });
  }
  GetPASValueIndex(i: any) {
    this.SParkAreaIndex = Array(this.ParkSettingOnly[i]);
    this.parking_lot_id = this.SParkAreaIndex[0]["parking_lot_id"];

    this.parkstaff = [];
    this.parkstaff1 = [];

    this.PAreaSer.OnGetStaff(this.parking_lot_id).subscribe((Response) => {
      this.value2 = Response["Response"][1];
      this.value2.forEach((element, index) => {
       
        var elm = document.getElementById(element["staffid"]) as HTMLInputElement;
       if (elm) {
        elm.checked = true;
      }
      });
      // for(var i=0;i<=this.value2.length;i++){
      //   var elm = document.getElementById(this.value2[i]["staffid"]) as HTMLInputElement;
      //   elm.checked = true;
      // }
    });
  }


  checkParkAssign(staffid: string) {    // function for checking parking spacce staff assign modification
    // this.value2.forEach((element, index) => {
    //   var elm = document.getElementById(staffid) as HTMLInputElement;
    //   console.log(elm);
    //   elm.checked = true;
    // });
  }
  OnParkStaff(value: any) {
    var itemvalue2 = $('.mycheckbox:checked');
    for (var i = 0; i < itemvalue2.length; i++) {
      this.parkstaff.push(itemvalue2[i]["value"]);
    }

    var itemvalue1 = $('.mycheckbox:not(:checked)');
    for (var i = 0; i < itemvalue1.length; i++) {

      this.parkstaff1.push(itemvalue1[i]["value"]);

    }

    this.PAreaSer.OnStaffAssign(this.parkstaff, this.SParkAreaIndex[0]["parking_lot_id"], this.parkstaff1).subscribe((Response) => {

      this.logcode5 = Response["Response"][0][0]["_logcode"]
      if (this.logcode5 == '1650') {
        this.toaster.success("Staff Assigned to Parking Sapce");
        $('#mytable').DataTable().destroy();
        this.OnGetPSetting();
      }
      else if (this.logcode5 == '1651') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });



  }



  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.PAreaSer.ParkArea = {
      token: '',
      orgid: '',
      parkingspacename: '',
      lat: '',
      lng: '',
      parkingspacetype: '',
      type: '',
      locationname: '',
      parking_lot_id: '',
      isactive: '',
      parking_type: '',
      parking_lot_name: '',
      Token: "",
      ParkingSpaceId: "",
      url: [],
      topic:"",
      Settings:
      {
        Region: "",
        VehicleType:
        {
          name: ""
        },
        autoexit:
        {
          name: ""
        },
        Payment: "",
        MaxTime: "",
        VehPrefix: "",
        Pnumber: "",
        Vas: "",
        availability: "",
        start: "",
        end: "",
        about: "",
        leadtime: "",
        buffer: "",
        fastslot: "",
        customertype:
        {
          type: ""
        },
        walletamount: "",
        reservation:""
      }
    }

    this.New = {
      Token: "",
      ParkingSpaceId: "",
      Settings:
      {
        Region: "",
        VehicleType:
        {
          name: ""
        },
        autoexit:
        {
          name: ""
        },
        Payment: "",
        MaxTime: "",
        VehPrefix: "",
        Pnumber: "",
        Vas: "",
        availability: "",
        start: "",
        end: "",
        about: "",
        leadtime: "",
        buffer: "",
        fastslot: "",
        customertype:
        {
          type: ""
        },
        walletamount: "",
        reservation:"",
      }
    }

    this.ParkSetting = {
      token: '',
      orgid: '',
      parkingspacename: '',
      lat: '',
      lng: '',
      parkingspacetype: '',
      type: '',
      locationname: '',
      parking_lot_id: '',
      isactive: '',
      parking_type: '',
      parking_lot_name: '',
      Token: "",
      ParkingSpaceId: "",
      url: [],
      topic: "",
      Settings:
      {
        Region: "",
        VehicleType:
        {
          name: ""
        },
        autoexit:
        {
          name: ""
        },
        Payment: "",
        MaxTime: "",
        VehPrefix: "",
        Pnumber: "",
        Vas: "",
        availability: "",
        start: "",
        end: "",
        about: "",
        leadtime: "",
        buffer: "",
        fastslot: "",
        customertype:
        {
          type: ""
        },
        walletamount: "",
        reservation:""
      }
    }

  }

  OnGetVehicleType() {

    this.VehicleType.GetVehicleCateory().subscribe((Response) => {
    });
  }

  OnGetPSetting() {
    this.spinner.show();
    this.PAreaSer.OnGetPAreaSettingSer().subscribe((Response) => {
      this.VehType = Response["Response"][3];
      this.custtype = Response["Response"][5];
      this.logcode5 = Response["Response"][0][0]["_logcode"]
      if (this.logcode5 == '1470') {

        this.ParkSettingOnly = Response["Response"][1];
        this.spinner.hide();
        this.NewParkSetting = Response["Response"][2];
        this.StaffName1 = Response["Response"][4];
        $('#mytable').DataTable().destroy();
        $(document).ready(function () {
          var table = $('#mytable').DataTable();
          table.draw();
        });
      }
      else if (this.logcode5 == '1471') {
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

  OnAddPArea() {

    this.PAreaSer.OnAddPAreaSer().subscribe((result) => {
      this.logcode = result["Response"][0][0]["_logcode"]
      if (this.logcode == '1160') {
        this.toaster.success("Parking Space Created");
        $('#mytable').DataTable().destroy();
        this.OnGetPSetting();
        this.PAreaSer.ParkArea.url = [];
      }
      else if (this.logcode == '1162') {
        this.toaster.info("Parking Sapce Already Exist");
      }
      else if (this.logcode == '1161') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);

      }

    },
      (erro: HttpErrorResponse) => {
        this.toaster.warning("Can't Able To Connect With DataBase");

      }
    );
  }

  GetPAValueIndex(i: any) {

    this.ParkAreaIndex = Array(this.ParkSettingOnly[i]);
    let rawUrls = this.ParkAreaIndex[0]["url"];
    if (typeof rawUrls === 'string') {
      this.ParkAreaImage = JSON.parse(rawUrls).map((url: string) => url.trim());
    } else if (Array.isArray(rawUrls)) {
      this.ParkAreaImage = rawUrls.map(url => url.trim());
    } else {
      this.ParkAreaImage = [];
    }
  }

  removeImage(index: number) {
    this.ParkAreaImage.splice(index, 1);
    this.PAreaSer.ParkArea.url.splice(index, 1);
    // console.log('Updated Parking Area Image URLs: ', this.ParkAreaImage);
    // console.log('Updated Parking Area Image URLs: ', this.PAreaSer.ParkArea.url);
  }
  GetParkingLotsIndex(j: any) {
    this.ParkLotsIndex = Array(this.ParkSettingOnly[j]);

    localStorage.setItem('LotsDetails', JSON.stringify(this.ParkLotsIndex));
  }
  val: boolean = false;

  vehtype: string;
  customertype: string;
  radioElement: HTMLInputElement;
  GetPAValueIndex1(i: any) {
    this.PAreaSer.ParkArea.url = [];
    this.ParkSettingAll = Array(this.NewParkSetting[i]);
    this.buffervalue = this.ParkSettingAll[0]["buffer"];
    this.fslots = this.ParkSettingAll[0]["fastslot"];
    if (this.ParkSettingAll[0]["paymenttype"] == null) {
      this.ParkSettingAll[0]["paymenttype"] = "postpaid";
    }
    if (this.ParkSettingAll[0]["reservation"] == null) {
      this.ParkSettingAll[0]["reservation"] = "0";
    }
    if (this.ParkSettingAll[0]["region"] == "null") {
      this.ParkSettingAll[0]["region"] = "";

    }
    if (this.ParkSettingAll[0]["vehiclenoprefix"] == "null" || this.ParkSettingAll[0]["vehiclenoprefix"] == null) {
      this.ParkSettingAll[0]["vehiclenoprefix"] = "";

    }
    if (this.ParkSettingAll[0]["parkmaxtime"] == "null" || this.ParkSettingAll[0]["parkmaxtime"] == null) {
      this.ParkSettingAll[0]["parkmaxtime"] = "";
    }
    if (this.ParkSettingAll[0]["leadtime"] == "null" || this.ParkSettingAll[0]["leadtime"] == null) {
      this.ParkSettingAll[0]["leadtime"] = "";
    }
    if (this.ParkSettingAll[0]["buffer"] == "null" || this.ParkSettingAll[0]["buffer"] == null) {
      this.ParkSettingAll[0]["buffer"] = "";
    }
    if (this.ParkSettingAll[0]["fastslot"] == "null" || this.ParkSettingAll[0]["fastslot"] == null) {
      this.ParkSettingAll[0]["fastslot"] = "";
    }

    this.vehtype = this.ParkSettingAll[0]["vehicletype"];
    this.customertype = this.ParkSettingAll[0]["customertype"];
    this.autoexittype = this.ParkSettingAll[0]["autoexit"];

    if (this.vehtype != null) {
      this.vehtypearray = this.vehtype
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .split(",")
    .map(v => v.trim());
      this.vehtypearray.forEach((element, index) => {
      });
    }
     if (this.autoexittype != null) {
      this.autoexittypearray = this.autoexittype
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .split(",")
    .map(v => v.trim());
      this.autoexittypearray.forEach((element, index) => {
      });
    }
    if (this.customertype != null) {
      this.customertypearray = this.customertype.replace("[", "").replace("]", "").replace(/ /g, "").split(",");
      this.customertypearray.forEach((element, index) => {

      });
    }
  }


  onVehicleToggle(vetype: string, isChecked: boolean) {
  if (this.callCountFlag) {
    if (isChecked) {
      if (!this.vehtypearray.includes(vetype)) {
        this.vehtypearray.push(vetype);
      }
    } else {
      this.vehtypearray = this.vehtypearray.filter(
        el => el.toUpperCase() !== vetype.toUpperCase()
      );
    }
  }
  
}
  onAutoExitToggle(vetype: string, isChecked: boolean) {
  if (this.callCountFlag) {
    if (isChecked) {
      if (!this.autoexittypearray.includes(vetype)) {
        this.autoexittypearray.push(vetype);
      }
    } else {
      this.autoexittypearray = this.autoexittypearray.filter(
        el => el.toUpperCase() !== vetype.toUpperCase()
      );
    }
  }
}
onCustomerToggle(csttype: string, isChecked: boolean) {
  if (this.callcustflag) {
    if (isChecked) {
      if (!this.customertypearray.includes(csttype)) {
        this.customertypearray.push(csttype);
      }
    } else {
      this.customertypearray = this.customertypearray.filter(
        el => el.toUpperCase() !== csttype.toUpperCase()
      );
    }
  }
}
  toggle() {
    this.callCountFlag = true;
  }
  custToggle(){
    this.callcustflag = true;
  }
  staffToggle(){
    this.staffcountflag = true;
  }

  value1(value: string) {
  }

  OnChangeStatusPArea(ParkAreaChange: Parkingarea) {

    ParkAreaChange.parking_lot_id = ParkAreaChange.parking_lot_id;
    if (ParkAreaChange.isactive == '1') {
      ParkAreaChange.isactive = '0';
      this.count = "1";
    }
    else {
      this.count = "2";
      ParkAreaChange.isactive = '1';
    }


    this.PAreaSer.OnChageStatusPArea(ParkAreaChange).subscribe((result) => {
      this.logcode = result["Response"][0][0]["_logcode"]
      if (this.logcode == '1170') {
        if (this.logcode == '1170' && this.count == '1') {
          this.toaster.success("Status Deactivated");
        }
        else if (this.logcode == '1170' && this.count == '2') {
          this.toaster.success("Status Activated");
        }
      }
      else if (this.logcode == '1171') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {
        this.toaster.warning("Can't Able To Connect With DataBase");
      });
  }

  OnUpdatePArea(ParkAreaEdit: Parkingarea) {
    ParkAreaEdit.parkingspacename = this.ParkAreaIndex[0]["parking_lot_name"];
    ParkAreaEdit.parkingspacetype = this.ParkAreaIndex[0]["parking_type"];
  
    if(this.PAreaSer.ParkArea.url.length!=0){
      ParkAreaEdit.url = this.PAreaSer.ParkArea.url;
     // ParkAreaEdit.url = this.ParkAreaImage;
    }else{
      ParkAreaEdit.url = this.ParkAreaImage;
      //ParkAreaEdit.url=this.PAreaSer.ParkArea.url;
    }
    
    this.PAreaSer.OnUpdatePASer(ParkAreaEdit).subscribe((result) => {
      this.logcode1 = result["Response"][0][0]["_logcode"]
      if (this.logcode1 == '1163') {
        this.toaster.success("Parking Space Updated");
        $('#mytable').DataTable().destroy();
        this.OnGetPSetting();
        this.ngOnInit();
        this.PAreaSer.ParkArea.url = [];
      }
      else if (this.logcode1 == '1161') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {

        this.toaster.warning("Can't Able To Connect With DataBase");
      });
    this.resetform();

  }


  vehiclearraytype: string[] = [];
  custarraytype: string[] = [];
  autoexitarraytype: string[] = [];
  OnPAreaSetting(Park: Parkingarea) {
    var itemvalue = $('.mycheckbox:checked');
    for (var i = 0; i < itemvalue.length; i++) {
      this.vehiclearraytype.push(itemvalue[i]["value"]);
    }
    var custvalue =  $('.mycheckbox1:checked');
    for (var j = 0; j < custvalue.length; j++) {
      this.custarraytype.push(custvalue[j]["value"]);
    }
    var autoexitvalue = $('.mycheckbox2:checked');
    for (var k = 0; k < autoexitvalue.length; k++) {
      this.autoexitarraytype.push(autoexitvalue[k]["value"]);
    }
    this.ParkSettingAll[0]["vehicletype"] = this.vehiclearraytype;
    this.vehiclearraytype = [];
    this.ParkSettingAll[0]["customertype"] =  this.custarraytype;
    this.custarraytype =[];
    this.ParkSettingAll[0]["autoexit"] =  this.autoexitarraytype;
    this.autoexitarraytype =[];
    this.New.ParkingSpaceId = this.ParkSettingAll[0]["parking_lot_id"];
    this.New.Settings.Region = this.ParkSettingAll[0]["region"];
    this.New.Settings.MaxTime = this.ParkSettingAll[0]["parkmaxtime"];
    this.New.Settings.VehPrefix = this.ParkSettingAll[0]["vehiclenoprefix"];
    // this.New.Settings.VehicleType = this.ParkSettingAll[0]["vehicletype"];
    this.New.Settings.VehicleType = this.ParkSettingAll[0]["vehicletype"];
    this.New.Settings.customertype = this.ParkSettingAll[0]["customertype"];
    this.New.Settings.autoexit = this.ParkSettingAll[0]["autoexit"];
    this.New.Settings.Payment = this.ParkSettingAll[0]["paymenttype"];
    this.New.Settings.Pnumber = this.ParkSettingAll[0]["panicnumber"];
    this.New.Settings.Vas = this.ParkSettingAll[0]["vas"];
    this.New.Settings.availability = this.ParkSettingAll[0]["availability"];
    this.New.Settings.about = this.ParkSettingAll[0]["about"];
    this.New.Settings.leadtime = this.ParkSettingAll[0]["leadtime"];
    this.New.Settings.buffer = this.ParkSettingAll[0]["buffer"];
    this.New.Settings.fastslot = this.ParkSettingAll[0]["fastslot"];
    this.New.Settings.walletamount = this.ParkSettingAll[0]["walletamount"];
    this.New.Settings.reservation = this.ParkSettingAll[0]["reservation"];
    if (this.New.Settings.availability == "custom") {
      var start = this.ParkSettingAll[0]["start"];
      this.New.Settings.start=start;
      //this.New.Settings.start = this.datepipe.transform(start, 'h:mm a');
      var end = this.ParkSettingAll[0]["end"];
      this.New.Settings.end=end;
      //this.New.Settings.end = this.datepipe.transform(end, 'h:mm a');
    } else {
      this.New.Settings.start = "";
      this.New.Settings.end = "";
    }
    if(this.New.Settings.walletamount == ''){
      this.New.Settings.walletamount = '0';
    }
    this.PAreaSer.OnParkSetting(this.New).subscribe((result) => {
      this.logcode1 = result["Response"][0][0]["_logcode"]
      if (this.logcode1 == '1460') {
        this.toaster.success("Parking Space Settings Updated");
        $('#mytable').DataTable().destroy();
        this.OnGetPSetting();
      }
      else if (this.logcode1 == '1461') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);

      }
    },
      (erro: HttpErrorResponse) => {

        this.toaster.warning("Can't Able To Connect With DataBase");
      });
  }

  reset() {
    this.resetform();
  }
  OrgUnderMe() {
    this.PAreaSer.ogUnderme().subscribe((Response) => {
      this.logunderme = Response["Response"][0][0]["_logcode"]
      if (this.logunderme == "1840") {
        this.undermeList = Response["Response"][1];
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
  nameSelect() {
    $.fn.dataTable.ext.search.push(
      function (settings, data, dataIndex) {
        var name = $("#orgtypename").val();
        var orgtypename = data[2] || "";

        if (name == orgtypename || name == 0) {
          return true;
        }
      });
    $('#mytable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable').DataTable();
      table.draw();
    });
  }
  tarifflistValues(i: any) { //function for listing the tariffs assigned to the parking space
    this.tarifflistindex = Array(this.ParkSettingOnly[i]);
    this.PAreaSer.parkingspaceid = this.tarifflistindex[0]["parking_lot_id"];
    this.PAreaSer.TariffList().subscribe((Response) => {
      this.logtarifflist = Response["Response"][0][0]["_logcode"];
      if (this.logtarifflist == "1900") {
        if(Response["Response"][1].length!=0){
          this.tarifflist = Response["Response"][1];
          this.viewtariff=0;
        }else if(Response["Response"][1].length==0){
            this.viewtariff=1;
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

  boombarrierList(i: any) {
    var boombarrierindex = Array(this.ParkSettingOnly[i]);
    this.PAreaSer.parkingspaceid = boombarrierindex[0]["parking_lot_id"];
    this.PAreaSer.boombarrierList().subscribe((Response) => {
      var boomlistlog = Response["Response"][0][0]["_logcode"];
      if (boomlistlog == "2050") {
        if(Response["Response"][1].length!=0){
          this.boombarrierlist = Response["Response"][1];
          this.viewbb=0;
        }else if(Response["Response"][1].length==0){
            this.viewbb=1;
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
  triggerValueTrue() {
    this.viewflag = 1;
  }
  triggerValueFalse() {
    this.viewflag = 0;
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }
  urlvalue(url: any) {
    this.url = url;
    
    this.PAreaSer.ParkArea.url.push(url);
  }

  getParkingLotCount(i: any) {    //function for getting the count of active parking lots for validation in settings
    var index = Array(this.ParkSettingOnly[i]);
    this.PLotservice.lotsid = index[0]["parking_lot_id"];
    this.PLotservice.OnGetPLotSer().subscribe((Response) => {
      var countlog = Response["Response"][0][0]["_logcode"];
      if (countlog == '1260') {
        this.lotcount = Response["Response"][2][0]["counts"];
        this.actualbufslot = Number(this.lotcount) - Number(this.fslots);
        // this.actualbufslot = Number(this.lotcount);
        this.actualfastslot = Number(this.lotcount) - Number(this.buffervalue);
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        localStorage.removeItem("LotsDetails");
        this.router.navigate(['login']);
      }
    });
  }
  onSearchChange(searchValue: string): void {   //function for checking the buffer value
    if (searchValue > this.actualbufslot) {
      this.toaster.info("Buffer value must be less than" + this.actualbufslot);
      this.buttonview = false;
    } else {
      this.buttonview = true;
    }
  }
  onFastTagChange(searchValue: string): void {   //function for checking the buffer value
    if (searchValue > this.actualfastslot) {
      this.toaster.info("Buffer value must be less than" + this.actualfastslot);
      this.buttonview = false;
    } else {
      this.buttonview = true;
    }
  }
  displayList(i: any) {
    var diplayindex = Array(this.ParkSettingOnly[i]);
    this.PAreaSer.parkingspaceid = diplayindex[0]["parking_lot_id"];
    this.PAreaSer.displaylist().subscribe((Response) => {
      var displaylistlog = Response["Response"][0][0]["_logcode"];
      if (displaylistlog == "2550") {
        if(Response["Response"][1].length!=0){
          this.displaylistdat = Response["Response"][1];
          this.viewdisplay=0;
        }else if(Response["Response"][1].length==0){
            this.viewdisplay=1;
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

  messagetoaster(){
    this.toaster.success('Saved Successfully:)');
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
}
  //Getting AWS credentials
  OnGetAwsSetting() {
    this.PAreaSer.OnGetPAreaSettingSer().subscribe((Response) => {
      if (Response["Response"] && Response["Response"][6] && Response["Response"][6][0]) {
        this.accesskeyid = Response["Response"][6][0]["accesskeyid"];
        this.secretaccesskey = Response["Response"][6][0]["secretaccesskey"];
        this.bucketname = Response["Response"][6][0]["bucketname"];
  
  
        AWS.config.update({
          region: 'ap-south-1',
          accessKeyId: this.accesskeyid,
          secretAccessKey: this.secretaccesskey,
        });
  
        // console.log('AWS Credentials loaded:', this.accesskeyid, this.secretaccesskey, this.bucketname);
      } else {
        this.toaster.error('Failed to retrieve AWS credentials');
      }
    }, (error) => {
      this.toaster.error('Error fetching AWS credentials');
      console.error('Error fetching credentials:', error);
    });
  }
  
  //function for uploading images onto AWS 
  onUpload() {
    // console.log('Selected files: ', this.selectedFiles);
    
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.toaster.error('Please select at least one file to upload');
      return;
    }

    if (!this.accesskeyid || !this.secretaccesskey || !this.bucketname) {
      this.toaster.error('AWS credentials are not loaded');
      return;
    }

    const s3 = new AWS.S3();
    const uploadedUrls: string[] = [];

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const selectedFile = this.selectedFiles[i];
      const params = {
        Bucket: this.bucketname,
        Key: `parkingspace/image_${Date.now()}_${i}`,
        Body: selectedFile,
        ContentType: selectedFile.type 
      };

      s3.upload(params, (err, data) => {
        if (err) {
          this.toaster.error('Error uploading image to S3');
          return;
        }
        uploadedUrls.push(data.Location);
        // console.log('Image uploaded successfully:', data.Location);
        if (uploadedUrls.length === this.selectedFiles.length) {
          this.toaster.success('All images uploaded successfully!');
          if (this.ParkAreaImage && this.ParkAreaImage.length > 0) {
            this.PAreaSer.ParkArea.url = [...this.ParkAreaImage, ...uploadedUrls];
          } else {
            this.PAreaSer.ParkArea.url = uploadedUrls;
          }
        }
      });
    }
}

 disabedDAte(i: any) {
    var bookingdisableddate = Array(this.ParkSettingOnly[i]);
    this.PAreaSer.parkingspaceid = bookingdisableddate[0]["parking_lot_id"];
    this.PAreaSer.getDisabledDate().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == "100") {
        if(Response["Response"][1].length!=0){
          this.disableddates = Response["Response"][1];
          this.viewdates=0;
        }else if(Response["Response"][1].length==0){
            this.viewdates=1;
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
saveDates(){
 this.PAreaSer.date=this.disableddate;
  if(this.disableddate=='' || this.disableddate==null){
    this.toaster.warning("Please Select a Date")
  }else{
    this.PAreaSer.addDisabledDate().subscribe((Response)=>{
   let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == "90") {
        this.toaster.success("Saved Successfully:)");
        this.disableddate='';
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
}
}
