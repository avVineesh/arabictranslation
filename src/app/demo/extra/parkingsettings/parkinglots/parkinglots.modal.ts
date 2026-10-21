export class Parkinglots {

    parking_lot_id: string;
    parkingspaceid :string;
    parkingnumber :string;
    vehtype :string;
    token:string;
    isactive:string;
    parking_lot_name:string;
    vehicletype:string;
    deviceid:any;
    nwproviderid:any;
    devicestatus:string;
    clusterid:any;
}
export class PLotsDetailsModel{


    parking_lot_id: string;
    parking_lot_name: string;

}



export class BulkParkLotUpload{
  Token:string;
  ParkSpaceId:string;
  BulkArray:any[];
  lotname:any[];
}

export class park{
    parkinglot:string;
    vetype:string;
}

export class BulkDeviceAllocation{
    networkid:any;
    token:any;
    parkingspaceid:any;
    parkingslotid:any;
}
export class CountSlot{
    token:any;
    parkingspaceid:any;
    slotname:any;
    parkingslotid:any;
}
export class SelectDevice{
    token:any;
    parkingspaceid:any;
    parkingslotid:any;
}
export class CsvData {
    column:any;
    number:any;
    row:any;
    value:any;
    direction:any;
    spot:any;
    path:any;
    road:any;
}
export class Layout {
    token:any;
    parkingspaceid:any;
    layout:any;
}
export class Cluster {
    token:any;
    clustername:any;
    clusterid:any;
    parkinglots:any[];
}