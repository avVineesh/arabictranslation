import { Injectable } from '@angular/core';
import {Feemodal,Monthlypass, UpdateModal} from './monthlypass.modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class MonthlypassService {
feeStructure:Feemodal
Monthlypass:Monthlypass;
AddMonPasServ?:boolean;
EditMonPasSer?:boolean;
monthedit: any;
orgid: any;
  id: any;
  isendpoint: number;
  isorg: number;
  token: any;
  type:any;
   date: string;
  todate:string;
  constructor(public urlservice:LoginserviceService,
    public http:HttpClient) { }
  GetFeeDetails(){
    this.feeStructure.token=JSON.parse(localStorage.getItem('access_token'));
    this.feeStructure.unit='month';
    return this.http.get(this.urlservice.url+'elw_getmonthpassdetails?token='+ this.feeStructure.token +'&parking_lot_id='+this.feeStructure.parking_lot_id+'&unit='+this.feeStructure.unit);
  }
   AddMonthlyPass(){
     this.feeStructure.token=JSON.parse(localStorage.getItem('access_token'));
     let Form = JSON.stringify( this.feeStructure);
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json'
         
       })
     };   
    
    return this.http.post(this.urlservice.url+'elw_savemonthpass',Form,httpOptions);
   }
   GetMonthlyPass(){
    this.feeStructure.token=JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url+'elw_getmonthpasslist?token='+ this.feeStructure.token+ '&id='+this.id+ '&isorg='+this.isorg+'&date='+this.date+ '&type='+this.type+ '&todate='+this.todate );
  }
  UpdateMonthlyPass(data: UpdateModal){
    data.token=JSON.parse(localStorage.getItem('access_token'));
    let Data = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   
   return this.http.post(this.urlservice.url+'elw_updatemonthlypass',Data,httpOptions);
  }
  addCustompass(){
    this.feeStructure.token=JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify( this.feeStructure);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   
   return this.http.post(this.urlservice.url+'elw_savecustompass',Form,httpOptions);
  }
  getDayTariff(){
    this.feeStructure.token=JSON.parse(localStorage.getItem('access_token'));
    this.feeStructure.unit='day';
    return this.http.get(this.urlservice.url+'elw_getdaytariff?token='+ this.feeStructure.token +'&parking_lot_id='+this.feeStructure.parking_lot_id+'&unit='+this.feeStructure.unit);
  }

  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getParkingspacelist(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkspacelist?token=' + this.token);
  }
}
