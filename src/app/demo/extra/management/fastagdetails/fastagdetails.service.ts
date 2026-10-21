import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Fastagdetails,requestdata} from './fastagdetails.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class FastagdetailsService {
  token: any;
  fastagmodal:Fastagdetails;
  type:any;
  parkinglogid:any;
  requestdata:requestdata;
  parkboxtoken:any;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  getFastagDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getfastagdetails?token=' + this.token);
  }
  filterFasTagData(){
    this.fastagmodal.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.fastagmodal);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json' 
         
      })
    };
    return this.http.post(this.urlservice.url+'elw_filterfastagdetails', Form,httpOptions1 );
  }
  getFastagParkingImg(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkingimages?token=' + this.token+'&id='+this.parkinglogid+'&type='+this.type);
  }
  callParkzappApi(){  // api call for parkzap fastag payment status..........................................
    let request_data = JSON.stringify(this.requestdata);
    return this.http.get(this.urlservice.url + 'elw_testfastagpaystatus?token=' + this.parkboxtoken+'&request_data='+request_data)
  }
  }

