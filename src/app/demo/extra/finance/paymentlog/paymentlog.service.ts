import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Paymentlog} from './paymentlog.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class PaymentlogService {
  token: any;
  paymentmodal:Paymentlog;
  orgid: any;
  id: any;
  isendpoint: number;
  isorg: number;
  status: string;
  date: string;
  todate:string;
  mode:any;
  constructor(public service:LoginserviceService, public http: HttpClient) { }
  getPaymentDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getpaymentlog?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&status='+this.status+ '&date='+this.date+ '&mode='+this.mode+ '&todate='+this.todate);
  }
   getFlagPaymentDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getpaymentflag?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+  '&date='+this.date+  '&todate='+this.todate);
  }
  getFilteredData(){
    this.paymentmodal.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.paymentmodal);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json' 
        
      })
    };
    return this.http.post(this.service.url+'elw_filterpaymentlogdata', Form,httpOptions1 );
  }
  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getParkingspacelist(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkspacelist?token=' + this.token);
  }
  resendSMS(data:any){
        let Form = JSON.stringify(data);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
            
          })
        };   
       return this.http.post(this.service.url+'elw_sendsms',Form,httpOptions);
      
  }
}
