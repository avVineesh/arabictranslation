export class GetParkingareaList {
    parking_lot_id: string;
    parking_lot_name: string;
}
export class GetParkingAreaReport {
    token: string;
    parking_lot_id: string;

}
export class ParkingAreaReportData {
    enddate: string;
    phonenumber: string;
    startdate: string;
    status: string;
    vehicletype: string;
    vehno: string;
}


export class ParkData{
    parking_lot_id: string;
    date:any;
    token:string;
    VType:string;
    entrytype: any;
}