import { Injectable } from '@angular/core';
import {Gates} from './gates.modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class GatesService {
gatedata:Gates;
token:any;
boombarrierid:any;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  saveGateData(){
    console.log("Reached here");
    this.gatedata.token =JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.gatedata);
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.urlservice.url+'elw_savegateinfo',Form,httpOptions);
  }
  getGateInfo(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getgateinfo?token=' + this.token+ '&boombarrierid='+this.boombarrierid);
  }
  changeGateStatus(data:Gates){
 

    let Data= JSON.stringify(data)
      console.log(Data);
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.urlservice.url+'elw_changegatestatus', Data,httpOptions1);
    }
}
