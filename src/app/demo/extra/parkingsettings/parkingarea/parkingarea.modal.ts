

export class Parkingarea {

     token:string;
     orgid :string;
     parkingspacename :string;
     lat :string;
     lng :string;
     parkingspacetype :string;
     type :string;
     locationname :string;
     parking_lot_id :string;
     isactive:string;
     parking_type:string;
     parking_lot_name:string;
     Token:string;
     Settings:ParkingSettings;
     ParkingSpaceId:string;
     url:any;
     topic:any;

}



export class ParkingSettings{

    
    Region:string;
    VehicleType:Vehicle;
    Payment:string;
    MaxTime:string;
    VehPrefix:string;
    Pnumber:string;
    Vas:string;
    availability:any;
    start:any;
    end:any;
    about:any;
    leadtime:any;
    buffer:any;
    fastslot:any;
    customertype:Customer;
    autoexit: Autoexit;
    walletamount:any;
    reservation:any;
    constructor(Region:string,VehicleType:Vehicle,Payment:string,MaxTime:string,VehPrefix:string, Pnumber:string,Valueaddesservices:string,availability:any,start:any,end:any,about:any,
        leadtime:any, buffer:any, fastslot:any, customertype:Customer, walletamount:any,reservation:any,autoexit:Autoexit){
       this.VehPrefix=VehPrefix;
       this.Payment=Payment;
       this.MaxTime=MaxTime;
       this.VehicleType=VehicleType;
       this.Region=Region;
       this.Pnumber=Pnumber;
       this.Vas=Valueaddesservices;
       this.availability=availability;
       this.start=start;
       this.end=end;
       this.about = about;
       this.leadtime = leadtime;
       this.buffer = buffer;
       this.fastslot =fastslot;
       this.customertype = customertype;
       this.walletamount = walletamount;
       this.reservation= reservation;
       this.autoexit= autoexit;
    }

}

export class Vehicle{
   name:string;
}
export class Autoexit{
   name:string;
}
export class Park{
    Token:string;
    ParkingSpaceId:string;
    Settings:ParkingSettings;
}

export class Parking{
    parking_type:type;
}
export class type{

}


export class StaffPark{
    Token:string;
    ParkSpaceId:string;
    StaffId:staff[];
}
export class staff{

}
export class Customer{
    type: string;
}