import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
frominvoice:any;
toinvoice:any;
  token: any;
  date: string;
  orgid: any;
  parkingspaceid:any;
  summarytypeoption:any;
  from:any;
  to:any;
  specification: any;
  constructor(public http: HttpClient,public service:LoginserviceService) { }

  getSummary(){
    this.token=JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getsummary?token=' +this.token+
    '&frominvoice='+this.frominvoice+'&toinvoice='+this.toinvoice+'&parkingspaceid='+this.parkingspaceid+'&summarytype='+this.summarytypeoption);
  }
  getSummarybyDate(){
    this.token=JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getsummarybydate?token=' +this.token+
    '&from='+this.from+'&to='+this.to+'&parkingspaceid='+this.parkingspaceid+'&summarytype='+this.summarytypeoption);
  }
  getParkingpaces(){
    this.token=JSON.parse(localStorage.getItem('access_token'));
    this.orgid=JSON.parse(localStorage.getItem('orgid'));
    return this.http.get(this.service.url+'elw_getparkingspace?token=' +this.token+
      '&orgid='+this.orgid);
  }
}
