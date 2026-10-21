import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { GetParkingareaList, GetParkingAreaReport, ParkData } from './parkingareareport.modal';
@Injectable({
  providedIn: 'root'
})
export class ParkingareareportService {
  token: any;
  type:any;
  parkinglogid:any;
  parkareaid: GetParkingareaList;
  FormData: GetParkingAreaReport;
  orgid: any;
  id: any;
  isorg: number;
  date:any;
  todate: any;
  isendpoint: number;
  constructor(public http: HttpClient,public service:LoginserviceService) { }

  GetParkingAreaList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getparkspacelist?token=' +this.token);
  }
  
  GetParkingAreaReport(parklistData: GetParkingAreaReport){
    parklistData.token= JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(parklistData);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json' 
        
      })
    };
    return this.http.post(this.service.url+'elw_getparkreport', Form,httpOptions1 );
  }

  GetParkByDate(data:ParkData){
     data.token= JSON.parse(localStorage.getItem('access_token'));
     return this.http.get(this.service.url+'elw_getparkreportbydate?token='+data.token+'&date='+data.date);
  }

  GetParkAll(){
    var token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getparkreportall?token='+token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
 }

 filterDailycollection(data:ParkData){
  data.token= JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url+'elw_getparkreportbyvehicledate?token='+data.token+'&date='+data.date+'&parking_lot_id='+data.parking_lot_id+'&entrytype='+data.entrytype);
}
getFastagParkingImg(){
  this.token = JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url + 'elw_getparkingimages?token=' + this.token+'&id='+this.parkinglogid+'&type='+this.type);
}
getOrgList(){
  this.token= JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
}

}
