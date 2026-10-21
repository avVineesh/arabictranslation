

export class Userrole {
    rolename : string;
    roledesc: string;
    token : string;
    orgid : string;
}
export class  GetUserRole{
    roleid : string;
    orgid : string;
    rolename : string;
    roledesc : string;
    created : string;
    isactive : string;
    canedit : string;
    canview : string;
    cancreate : string;
    privileges: string;
    token: string;
    index:string;
    type: string;
}

export class RolePriv{
    RoleId:string;
    Privilege:Privil;
    Token:string;
}

export class Privil{
    Privileges:Screens[];
}


export class Screens{
    Analytics:Analytics;
    Finanace:Finanace;
    Management:Management;
    ParkingSetting:ParkingSettings;
    AdminSetting:AdminSettings
    MobilePrivileges:MobilePrivileges
}


export class AdminSettings{
 
    OrgProf:Permission;
    Role:Permission;
    Staff:Permission;
    Tariff:Permission;
    OrgType:Permission;
    orgfunctionalmap:Permission;
    orgdomain:Permission;
}

export class Analytics{
    ParkingAreaReport:Permission;
    ParkedVehicle:Permission;
    // Revenue:Permission;
    Occupancy:Permission; 
    Summary:Permission;
    customreport:Permission;
    customanalytics:Permission;
    parkinghistory:Permission;
}

export class Finanace{
    Paymentlog:Permission;
    Refunds:Permission;
    Reconciliation:Permission;
}

export class Management{
    LiveView:Permission;
    Vehicles:Permission;
    CustomerDet:Permission;
    MonthlyPass:Permission;
    BookingDetails:Permission;
    FasTagdetails:Permission;
    NetworkMonitor:Permission;
    servicemonitor:Permission;
    boombarrierlog:Permission;
    valetdetails:Permission;
    employeetag:Permission;
    attendanceregister:Permission;
    blacklistedvehicles:Permission;
    assets:Permission;
}


export class ParkingSettings{
    ParkingLots:Permission;
    ParkingSpace:Permission;
    boombarrier:Permission;
    sensor:Permission;
    display:Permission;
    posdevices:Permission;
    rfreaders:Permission;
}
export class MobilePrivileges{
    fullsummary:Permission;
    analytics:Permission;
}
export class Permission{
    
    View:boolean;
    Edit:boolean;
    Create:boolean;
}