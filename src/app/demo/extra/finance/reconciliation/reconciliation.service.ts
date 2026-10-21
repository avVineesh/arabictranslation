import { Injectable } from '@angular/core';
import {requestdata,Reconciliation} from './reconciliation.modal';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class ReconciliationService {
requestdata: requestdata;
reconciliationdata: Reconciliation;
parkboxtoken:any;
fromdate:any;
todate:any;
date:any;
add?:boolean;
edit?:boolean;
  token: any;
  orgid: string;
  isendpoint: number;
  isorg: number;
  id: any;
  mode: any;
  filtdate:any;
  filttodate:any;
  reorgid:any;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }


  callParkzappApi(){  // api for calling fastag payment status from parkzap...........................
    let request_data = JSON.stringify(this.requestdata);
    
    return this.http.get(this.urlservice.url + 'elw_testfastagpaystatus?token=' + this.parkboxtoken+'&request_data='+request_data)
  }

  saveReconciliationData(){
    this.reconciliationdata.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.reconciliationdata);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json' 
        
      })
    };
    return this.http.post(this.urlservice.url+'elw_savereconciliationdata', Form,httpOptions1 );
  }
  getReconciliationDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url+'elw_getreconciliationdetails?token='+this.token+'&from='+this.filtdate+'&to='+this.filttodate );
  }
  getAcceptedFastagTransaction(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url+'elw_getacceptedtransaction?token='+this.token+'&date='+this.date+'&orgid='+this.reorgid);
  }
  getFailedFastagTransaction(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url+'elw_getfailedtransactions?token='+this.token+'&date='+this.date+'&orgid='+this.reorgid);
  }
  filterReconciliation(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url+'elw_filterreconciliation?token='+this.token+'&fromdate='+this.fromdate+'&todate='+this.todate+'&mode='+this.mode+ '&id='+this.id+ '&isorg='+this.isorg);
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
