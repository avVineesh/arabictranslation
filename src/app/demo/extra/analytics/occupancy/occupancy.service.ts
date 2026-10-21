import { Injectable } from '@angular/core';
import {Occupancy} from './occupancy.modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class OccupancyService {
  token: any;
  date:any;
  type:any;
  isvalid:any;
  orgid:any;
  id:any;
  isorg:any;
  manualurl= "https://supapi.kimshealth.elvicto-elpark.com/";
  clearModal: Occupancy;
  parkinglogid: any;
  todate: any;
  isendpoint: number;
  constructor(public http: HttpClient,public service:LoginserviceService) { }

  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getParkedVehicles(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getparkedvehicles?token='+this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
  }
  filterParkedVehicles(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_filterparkedvehicles?token='+this.token+'&date='+this.date+'&type='+this.type+'&isvalid='+this.isvalid);
  }
  clearParking(){
    
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_clearparking?token='+this.token+'&id='+this.id);
  }
  // callManualpayment(){
  //   this.clearModal.token = JSON.parse(localStorage.getItem('access_token'));
  //   let form = JSON.stringify(this.clearModal);
  //   const httpOptions1 = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json' 
         
  //     })
  //   };
  //   return this.http.post(this.manualurl+'sup_manualpayment', form,httpOptions1 );
  // }
  getFastagParkingImg(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkingimages?token=' + this.token+'&id='+this.parkinglogid+'&type='+this.type);
  }
  GetParkingAreaList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getparkspacelist?token=' +this.token);
  }
  Calcbalance(){
  this.token = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_getbalanceamountcalc?token='+this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
}
 manualClearVeh(){
  this.token = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_getmanualclearveh?token='+this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
}
}
