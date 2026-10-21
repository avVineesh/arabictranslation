export class GetVehicledetails {
    category: string;
    createddate: string;
    driverinfo: string;
    fullname: string;
    id: string;
    isdeleted: string;
    org_name: string;
    orgid: string;
    phone: string;
    userid: string;
    vehiclemake: string;
    vehiclemodel: string;
    vehicleno: string;
    token: string;
    type: string;
}
export class AddVehicledetails {
    token: any;
    vehicleno: any;
    vehicletype: any;
    vehmake:any;
    vehmodel:any;
    vehcolor:any;
    isprimary:any;
    isowner:any;
    ownerphone:any;
    custid: any;
}

 export class OwnershipChangeModal {
    id: any;
    vehicleno: any;
    vehicletype: any;
    vehmake: any;
    vehmodel: any;
    vehcolor: any;
    isprimary: any;
    createddate: any;
    isowner: any;
    ownerphone: any;
    token: any;
 }
 export class UpdateOwnVehicle{
     token :any;
     id:any;
     custid:any;
     segmentid:any;
     vehicleno:any;
     vehicletype:any;
 }