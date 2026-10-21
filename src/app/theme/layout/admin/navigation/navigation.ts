import { Injectable } from "@angular/core";
import { OrganizationdomainService } from "src/app/demo/extra/adminsettings/orgdomain/orgdomain.service";
import { OrgprofileService } from "src/app/demo/extra/adminsettings/orgprofile/orgprofile.service";
import { OrgtypeService } from "src/app/demo/extra/adminsettings/orgtype/orgtype.service";
import { RoleService } from "src/app/demo/extra/adminsettings/role/role.service";
import { SettariffService } from "src/app/demo/extra/adminsettings/settariff/settariff.service";
import { StaffService } from "src/app/demo/extra/adminsettings/staff/staff.service";
import { ViewtariffService } from "src/app/demo/extra/adminsettings/viewtariff/viewtariff.service";
import { ReconciliationService } from "src/app/demo/extra/finance/reconciliation/reconciliation.service";
import { CustomerdetailsService } from "src/app/demo/extra/management/customerdetails/customerdetails.service";
import { MonthlypassService } from "src/app/demo/extra/management/monthlypass/monthlypass.service";
import { EmployeetagService } from "src/app/demo/extra/management/rftagdetails/rftagdetails.service";
import { BoombarrierService } from "src/app/demo/extra/parkingsettings/boombarrier/boombarrier.service";
import { DisplayService } from "src/app/demo/extra/parkingsettings/display/display.service";
import { ParkingareaService } from "src/app/demo/extra/parkingsettings/parkingarea/parkingarea.service";
import { ParkinglotsService } from "src/app/demo/extra/parkingsettings/parkinglots/parkinglots.service";

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}
export interface Navigation extends NavigationItem {
  children?: NavigationItem[];


}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
       {
        id: 'landing',
        title: 'HOME',
        type: 'item',
        classes: 'nav-item',
        icon: 'feather icon-home',
        url: 'landing',
        hidden: false,
      },
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        icon: 'feather icon-activity',
        url: 'dashboard',
        hidden: false,
      },
      {
        id: 'management',
        title: 'Management',
        type: 'collapse',
        icon: 'feather icon-layers',
        hidden: false,
        children: [
          {
            id: 'passdetails',
            title: 'Pass Details',
            type: 'item',
            url: 'management/passdetails',
            hidden: false
          },
          {
            id: 'whitelistedvehicles',
            title: 'Whitelisted Vehicles',
            type: 'item',
            url: 'management/whitelistedvehicles',
            hidden: false
          },
          {
            id: 'bookingdetails',
            title: 'Booking Details',
            type: 'item',
            url: 'management/bookingdetails',
            hidden: false
          },
          {
            id: 'networkmonitoring',
            title: 'Network Monitoring',
            type: 'item',
            url: 'management/networkmonitoring',
            hidden: false
          },
          {
            id: 'valetparking',
            title: 'Valet Parking',
            type: 'item',
            url: 'management/valetparking',
            hidden: false
          },
          {
            id: 'rftagdetails',
            title: 'RF Tags',
            type: 'item',
            url: 'management/rftagdetails',
            hidden: false
          },
          {
            id: 'vehicleblacklisting',
            title: 'Vehicle Blacklisting',
            type: 'item',
            url: 'management/vehicleblacklisting',
            hidden: false
          },
          {
            id: 'assets',
            title: 'Assets Management',
            type: 'item',
            url: 'management/assets',
            hidden: false
          },
          {
            id: 'attendanceregister',
            title: 'Attendance Register',
            type: 'item',
            url: 'management/attendanceregister',
            hidden: false
          }
        ]
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    type: 'group',
    icon: 'icon-navigation',
    hidden: false,
    children: [
      {
        id: 'accounts',
        title: 'Accounts',
        type: 'collapse',
        icon: 'feather icon-file-minus',
        hidden: false,
        children: [
          {
            id: 'paymentdetails',
            title: 'Payment Details',
            type: 'item',
             url: 'finance/paymentlog',
             hidden: false
          },
          {
            id: 'refund',
            title: 'Refund Details',
            type: 'item',
             url: 'finance/refunds',
             hidden: false
          },
          {
            id: 'reconciliation',
            title: 'Reconciliation',
            type: 'item',
             url: 'finance/reconciliation',
             hidden: false
          },
           {
            id: 'fastagdetails',
            title: 'Fastag Details',
            type: 'item',
            url: 'management/fastagdetails',
            hidden: false
          },
        ]
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    type: 'group',
    icon: 'icon-charts',
    hidden: false,
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        type: 'collapse',
        icon: 'feather icon-pie-chart',
        hidden: false,
        children: [
          {
            id: 'parkingareareport',
            title: 'Daily Transaction',
            type: 'item',
            url: 'analytics/parkingareareport',
            hidden: false
          },
          {
            id: 'vehicleparkedreport',
            title: 'Parking Area Report',
            type: 'item',
            url: 'analytics/vehicleparkedreport',
            hidden: false
          },
          {
            id: 'occupancy',
            title: 'Parked Vehicles',
            type: 'item',
            url: 'analytics/occupancy',
            hidden: false
          },
          {
            id: 'customanalytics',
            title: 'Custom Anlaytics',
            type: 'item',
            url: 'analytics/customanalytics',
            hidden: false
          },
          {
            id: 'summary',
            title: 'Summary',
            type: 'item',
            url: 'analytics/summary',
            hidden: false
          },
            {
            id: 'parkinghistory',
            title: 'Parking History',
            type: 'item',
            url: 'analytics/parkinghistory',
            hidden: false
          },
        ]
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin Panel',
    type: 'group',
    icon: 'icon-navigation',
    hidden: false,
    children: [
      {
        id: 'adminsettings',
        title: 'Admin Settings',
        type: 'collapse',
        icon: 'feather icon-user',
        hidden: false,
        children: [
          {
            id: 'orgtype',
            title: 'Organization Type',
            type: 'item',
            url: 'adminsettings/orgtype',
            hidden: false
          },
          {
            id: 'orgprofile',
            title: 'Organization Profile',
            type: 'item',
            url: 'adminsettings/orgprofile',
            hidden: false
          },
          {
            id: 'role',
            title: 'User Role',
            type: 'item',
            url: 'adminsettings/role',
            hidden: false
          },
          {
            id: 'staff',
            title: 'Staff Details',
            type: 'item',
            url: 'adminsettings/staff',
            hidden: false
          },
          {
            id: 'vehiclecategory',
            title: 'Vehicle Category',
            type: 'item',
            url: 'adminsettings/vehiclecategory',
            hidden: false
          },
          {
            id: 'tariff',
            title: 'Tariff Details',
            type: 'item',
            url: 'adminsettings/settariff',
            hidden: false
          },
          {
            id: 'orgfunctionalmap',
            title: 'Organization Functional Map',
            type: 'item',
            url: 'adminsettings/orgfunctionalmap',
            hidden: false
          },
          {
            id: 'orgdomain',
            title: 'Organization Domains',
            type: 'item',
            url: 'adminsettings/orgdomain',
            hidden: false
          },
        ]
      },
      {
        id: 'parkingsettings',
        title: 'Parking Settings',
        type: 'collapse',
        icon: 'feather icon-book',
        hidden: false,
        children: [
          {
            id: 'parkingarea',
            title: 'Parking Space',
            type: 'item',
            url: 'parkingsettings/parkingarea',
            hidden: false
          },
          {
            id: 'boombarrier',
            title: 'Boombarrier',
            type: 'item',
            url: 'parkingsettings/boombarrier',
            hidden: false
          },
          {
            id: 'diaplay',
            title: 'Display',
            type: 'item',
            url: 'parkingsettings/display',
            hidden: false
          },
          {
            id: 'led',
            title: 'Led Bulb',
            type: 'item',
            url: 'parkingsettings/led',
            hidden: true
          },
          {
            id: 'posdevice',
            title: 'POS Devices',
            type: 'item',
            url: 'parkingsettings/posdevice',
            hidden: false
          },
          {
            id: 'rfreader',
            title: 'RF Reader',
            type: 'item',
            url: 'parkingsettings/rfreader',
            hidden: false
          }
        ]
      },
    ]
  },
  
  // {
  //   id: 'support',
  //   title: 'Support',
  //   type: 'group',
  //   icon: 'icon-support',
  //   hidden: false,
  //   children: [
  //     {
  //       id: 'documentation',
  //       title: 'Documentation',
  //       type: 'item',
  //       icon: 'feather icon-book',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/datta-angular/',
  //       target: true,
  //       external: true,
  //       hidden: false
  //     }
  //   ]
  // }
];
@Injectable()
export class NavigationItem {
  StaffPriv: string;
  adminitems: number=0;
  parkingitems: number=0;
  get() {
    return NavigationItems;
  }
  constructor(public orgprofileservice:OrgprofileService,
    public orgtype:OrgtypeService,
    public RoleAdd: RoleService, public StaffAdd: StaffService,
    public ParkAreaAdd: ParkingareaService, public ParkLotsAdd: ParkinglotsService,
    public MonPasAdd: MonthlypassService,
    public TariffAddservice: SettariffService,
    public TariffEditservice: ViewtariffService,
    public boomservice:BoombarrierService,
    public reconciliationservice:ReconciliationService,
    public custservice :CustomerdetailsService,
    public displayservice: DisplayService,
    public rftagservice:EmployeetagService,
    public orgdomainservice :OrganizationdomainService
  ){
    let StaffPriData = JSON.parse(localStorage.getItem('privilege'));
    let data = StaffPriData.Privileges;
    let finance = data[0]["Finanace"];
    let analytics = data[0]["Analytics"];
    let adminsetting = data[0]["AdminSetting"];
    let parksetting = data[0]["ParkingSetting"];
    let management = data[0]["Management"];


    this.RoleAdd.RoleAdSer = adminsetting.Role.Create;
    this.StaffAdd.AddStaffSer = adminsetting.Staff.Create;
    this.TariffAddservice.AddTariff = adminsetting.Tariff.Create;
    this.ParkAreaAdd.AddParkArea = parksetting.ParkingSpace.Create;
    this.ParkLotsAdd.AddParkLotSer = parksetting.ParkingLots.Create;
    this.boomservice.add = parksetting.boombarrier.Create;
    //this.sensorservice.add = parksetting.sensor.Create;
    this.MonPasAdd.AddMonPasServ = management.MonthlyPass.Create;
    this.orgprofileservice.AddOrgP = adminsetting.OrgProf.Create;
    this.orgtype.addorgtype =  adminsetting.OrgType.Create;
    this.reconciliationservice.add = finance.Reconciliation.Create;
    this.displayservice.add = parksetting.display.Create;
    this.orgdomainservice.add = adminsetting.orgdomain.Create;
    // this.rftagservice.add =  management.employeetag.Create;
    //Edit
    this.StaffAdd.EditStaffSer = adminsetting.Staff.Edit;
    this.RoleAdd.RoleEdSer = adminsetting.Role.Edit;
    this.orgprofileservice.EditP = adminsetting.OrgProf.Edit;
    this.TariffEditservice.EditTariff = adminsetting.Tariff.Edit;
    this.ParkAreaAdd.EditParkArea = parksetting.ParkingSpace.Edit;
    this.ParkLotsAdd.EditParkLotSer = parksetting.ParkingLots.Edit;
    this.boomservice.edit = parksetting.boombarrier.Edit;
    //this.sensorservice.edit = parksetting.sensor.Edit;
    this.MonPasAdd.EditMonPasSer = management.MonthlyPass.Edit;
    this.custservice.edit = management.CustomerDet.Edit;
    this.reconciliationservice.edit = finance.Reconciliation.Edit;
    this.displayservice.edit = parksetting.display.Edit;
    this.orgdomainservice.edit = adminsetting.orgdomain.Edit;
    // this.rftagservice.edit =  management.employeetag.Edit;
    //Privilege
    //Staff
    this.StaffPriv = localStorage.getItem("rolename");
    if (this.StaffPriv == 'Admin' || this.StaffPriv == 'admin') {
      this.StaffAdd.StaffPriv = true;
      this.RoleAdd.RolePriv = true;
    }
    else {
      this.StaffAdd.StaffPriv = false;
      this.RoleAdd.RolePriv = false;
    }

     //Management Privileges

    //Management Monthly Pass 
    if (management.MonthlyPass.View == true) {
      NavigationItems[0]["children"][2]["children"][0]["hidden"] = false;
    }
    else {
      NavigationItems[0]["children"][2]["children"][0]["hidden"] = true;
    }
    // Management CustomerDetails Privilege
    if(management.CustomerDet.View==true){
      NavigationItems[0]["children"][2]["children"][1]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][1]["hidden"]=true;
    } 
    //Management BookingDetails Privilege
    if(management.BookingDetails.View==true){
      NavigationItems[0]["children"][2]["children"][2]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][2]["hidden"]=true;
    } 
   
    //Network monitoring privileges 
    if(management.NetworkMonitor.View==true){
      NavigationItems[0]["children"][2]["children"][3]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][3]["hidden"]=true;
    } 
    
    // Management Valet Details Privilege
    if(management.valetdetails.View==true){
      NavigationItems[0]["children"][2]["children"][4]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][4]["hidden"]=true;
    } 
    // Management Custom RF Tag privilege
    if(management.employeetag.View==true){
      NavigationItems[0]["children"][2]["children"][5]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][5]["hidden"]=true;
    } 

    if(management.blacklistedvehicles.View==true){
      NavigationItems[0]["children"][2]["children"][6]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][6]["hidden"]=true;
    } 

    if(management.assets.View==true){
      NavigationItems[0]["children"][2]["children"][7]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][7]["hidden"]=true;
    } 
    // Management attendance details Privilege
    if(management.attendanceregister.View==true){
      NavigationItems[0]["children"][2]["children"][8]["hidden"]=false;
    }
    else{
      NavigationItems[0]["children"][2]["children"][8]["hidden"]=true;
    } 

    //  FINANCE PRIVILEGES
    // Finance Payment details privilege
    if(finance.Paymentlog.View==true){
      NavigationItems[1]["children"][0]["children"][0]["hidden"]=false;
    }
    else{
      NavigationItems[1]["children"][0]["children"][0]["hidden"]=true;
    } 
    //Refund Privilege
    if(finance.Refunds.View==true){
      NavigationItems[1]["children"][0]["children"][1]["hidden"]=false;
    }
    else{
      NavigationItems[1]["children"][0]["children"][1]["hidden"]=true;
    } 
    // Reconciliation Privilege view
    if(finance.Reconciliation.View==true){
      NavigationItems[1]["children"][0]["children"][2]["hidden"]=false;
    }
    else{
      NavigationItems[1]["children"][0]["children"][2]["hidden"]=true;
    } 
     //Management Fattag Details privilege 
    if(management.FasTagdetails.View==true){
      NavigationItems[1]["children"][0]["children"][3]["hidden"]=false;
    }
    else{
      NavigationItems[1]["children"][0]["children"][3]["hidden"]=true;
    } 
     //Analytics Privileges

    //ParkingAreaReport 
    if (analytics.ParkingAreaReport.View == true) {
      NavigationItems[2]["children"][0]["children"][0]["hidden"] = false;
    }
    else {
      NavigationItems[2]["children"][0]["children"][0]["hidden"] = true;
    }
    //ParkedVehicle 
    if (analytics.ParkedVehicle.View == true) {
      NavigationItems[2]["children"][0]["children"][1]["hidden"] = false;
    }
    else {
      NavigationItems[2]["children"][0]["children"][1]["hidden"] = true;
    }
    // //Tax Report
    // if (analytics.TaxReport.View == true) {
    //   NavigationItems[2]["children"][0]["children"][3]["hidden"] = false;
    // }
    // else {
    //   NavigationItems[2]["children"][0]["children"][3]["hidden"] = true;
    // }
    // //Custom Report
    // if (analytics.customreport.View == true) {
    //   NavigationItems[2]["children"][0]["children"][4]["hidden"] = false;
    // }
    // else {
    //   NavigationItems[2]["children"][0]["children"][4]["hidden"] = true;
    // }
    //Occupancy-Parked vehicle report
    if (analytics.Occupancy.View == true) {
      NavigationItems[2]["children"][0]["children"][2]["hidden"] = false;
    }
    else {
      NavigationItems[2]["children"][0]["children"][2]["hidden"] = true;
    }
    //Custom Analytics privilege
    if (analytics.customanalytics.View == true) {
      NavigationItems[2]["children"][0]["children"][3]["hidden"] = false;
    }
    else {
      NavigationItems[2]["children"][0]["children"][3]["hidden"] = true;
    }
    // Summary Page View
    if (analytics.Summary.View == true) {
      NavigationItems[2]["children"][0]["children"][4]["hidden"] = false;
    }
    else {
      NavigationItems[2]["children"][0]["children"][4]["hidden"] = true;
    }
     if (analytics.parkinghistory.View == true) {
      NavigationItems[2]["children"][0]["children"][5]["hidden"] = false;
    }
    else {
      NavigationItems[2]["children"][0]["children"][5]["hidden"] = true;
    }
    //Admin Settings Privileges
    // Organization Type
    if (adminsetting.OrgType.View == true) {
      NavigationItems[3]["children"][0]["children"][0]["hidden"] = false;

    }
    else {
      NavigationItems[3]["children"][0]["children"][0]["hidden"] = true;

    }
    //Organization Profile
    if (adminsetting.OrgProf.View == true) {
      NavigationItems[3]["children"][0]["children"][1]["hidden"] = false;

    }
    else {
      NavigationItems[3]["children"][0]["children"][1]["hidden"] = true;

    }
    // Extraprivilege

    //Role 
    if (adminsetting.Role.View == true) {
      NavigationItems[3]["children"][0]["children"][2]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][0]["children"][2]["hidden"] = true;
    }
    //Staff 
    if (adminsetting.Staff.View == true) {
      NavigationItems[3]["children"][0]["children"][3]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][0]["children"][3]["hidden"] = true;
    }
    //Tariff

    if (adminsetting.Tariff.View == true) {
      NavigationItems[3]["children"][0]["children"][5]["hidden"]= false;
    }
    else {
      NavigationItems[3]["children"][0]["children"][5]["hidden"]= true;
    }
    // Organization Functional Map
    if (adminsetting.orgfunctionalmap.View == true) {
      NavigationItems[3]["children"][0]["children"][6]["hidden"]= false;
    }
    else {
      NavigationItems[3]["children"][0]["children"][6]["hidden"]= true;
    }
    // Organization domain 
    if (adminsetting.orgdomain.View == true) {
      NavigationItems[3]["children"][0]["children"][7]["hidden"]= false;
    }
    else {
      NavigationItems[3]["children"][0]["children"][7]["hidden"]= true;
    }

    //Parking Settings Privileges

    //ParkingSpace 
    if (parksetting.ParkingSpace.View == true) {
      NavigationItems[3]["children"][1]["children"][0]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][1]["children"][0]["hidden"] = true;
    }
    //ParkingSlots
    // if (parksetting.ParkingLots.View == true) {
    //   NavigationItems[3]["children"][1]["children"][1]["hidden"] = false;
    // }
    // else {
    //   NavigationItems[3]["children"][1]["children"][1]["hidden"] = true;
    // }
    //Boom Barrier
    if (parksetting.boombarrier.View == true) {
      NavigationItems[3]["children"][1]["children"][1]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][1]["children"][1]["hidden"] = true;
    }
    // //Sensor Screen
    // if (parksetting.sensor.View == true) {
    //   NavigationItems[3]["children"][1]["children"][2]["hidden"] = false;
    // }
    // else {
    //   NavigationItems[3]["children"][1]["children"][2]["hidden"] = true;
    // }
    // Display Screen
    if (parksetting.display.View == true) {
      NavigationItems[3]["children"][1]["children"][2]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][1]["children"][2]["hidden"] = true;
    }
    // POS Device Screen
    if (parksetting.posdevices.View == true) {
      NavigationItems[3]["children"][1]["children"][4]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][1]["children"][4]["hidden"] = true;
    }
    // RF Reader  Screen
    if (parksetting.rfreaders.View == true) {
      NavigationItems[3]["children"][1]["children"][5]["hidden"] = false;
    }
    else {
      NavigationItems[3]["children"][1]["children"][5]["hidden"] = true;
    }
    //Hide All Category
    if (adminsetting.OrgProf.View == false && adminsetting.Role.View == false && adminsetting.Staff.View == false && adminsetting.Tariff.View == false 
      && adminsetting.OrgType.View == false && adminsetting.orgfunctionalmap.View == false && adminsetting.orgdomain.View == false) {
      NavigationItems[3]["children"][0]["hidden"] = true;
      this.adminitems=1;
    }
    if (management.MonthlyPass.View == false && management.CustomerDet.View==false && management.BookingDetails.View==false  && management.NetworkMonitor.View==false &&
       management.servicemonitor.View==false &&management.boombarrierlog.View==false && management.valetdetails.View==false && management.employeetag.View==false && management.attendanceregister.View==false && management.blacklistedvehicles.View==false && management.assets.View==false) {
      NavigationItems[0]["children"][2]["hidden"] = true;
    }
    if (parksetting.ParkingSpace.View == false && parksetting.ParkingLots.View == false && parksetting.boombarrier.View == false && parksetting.sensor.View == false && parksetting.display.View == false && parksetting.posdevices.View == false && parksetting.rfreaders.View == false) {
      NavigationItems[3]["children"][1]["hidden"] = true;
      this.parkingitems=1;
    }
    if (analytics.ParkingAreaReport.View == false && analytics.ParkedVehicle.View == false && 
      analytics.Summary.View == false && analytics.Occupancy.View == false && analytics.customanalytics.View == false 
    && analytics.parkinghistory.View == false) {
      NavigationItems[2]["children"][0]["hidden"] = true;
      NavigationItems[2]["hidden"]=true;
    }
    if (finance.Paymentlog.View==false && finance.Refunds.View==false&& finance.Reconciliation.View==false && management.FasTagdetails.View==false) {
      NavigationItems[1]["children"][0]["hidden"] = true;
      NavigationItems[1]["hidden"]=true;
    }
    if(this.adminitems==1&&this.parkingitems==1){
      NavigationItems[3]["hidden"] = true;
    }
  }
}