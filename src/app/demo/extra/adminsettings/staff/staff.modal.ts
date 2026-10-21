
export class Saffmodel {

    fullname:string;
    phone:string;
    password:string;
    orgid:string;
    token:string;
    parking_lot_name:string;
    Active:string;
    staffid:string;
    type:string;
    id:string;
    parking_lots_id:string;
    rolename:string;
    roleid:string;
    staffcode:string;
    todate:string;
    email:string;
    isactive:string;
    otp:string;
    repstaffname:string;
    mobileuser:any;
    reportingstaffid:string;
    parentid: string;
    hierarchytype:string;
}

export class StaffStatusCheck{ 
    staffid:string;
    token:string;
    isactive:string;

}



export class StaffPriv{
    StaffId:string;
    Privilege:Priv;
    Token:string;
}

export class Priv{
    Privileges:Screens[]
}


export class Screens{
    Analytics:Analytics;
    Finanace:Finanace;
    Management:Management;
    ParkingSetting:ParkingSettings;
    AdminSetting:AdminSettings
    MobilePrivileges:MobilePrivileges
}

export class Analytics{
    ParkingAreaReport:Permission;
    // Revenue:Permission;
    Occupancy:Permission;
    ParkedVehicle:Permission;
    Summary:Permission;
    customreport:Permission;
    customanalytics:Permission;
    parkinghistory:Permission;
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