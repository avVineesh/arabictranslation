import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customalalytics } from './customanalytics.modal';
import { LoginserviceService } from '../../login/loginservice.service';


@Injectable({
  providedIn: 'root'
})
export class CustomalalyticsService {
  customanalytics:Customalalytics;
  orgid: any;
  id: any;
  isorg: number;
  isendpoint: number;
  token: any;
  constructor(public http: HttpClient,public service:LoginserviceService) { }

  getCustomAnalytics(){

    this.customanalytics.token =JSON.parse(localStorage.getItem('access_token'));
    this.customanalytics.spaceid=this.id;
    let Form = JSON.stringify(this.customanalytics);
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.service.url+'elw_customanalytics',Form,httpOptions);
  }
  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getParkingSpace(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkingspacefordashboard?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg );
  }
 getParkingspacelist(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkspacelist?token=' + this.token);
  }
}
