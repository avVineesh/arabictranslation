import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ledconfig } from './led.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class LedconfigService {
ledmodal:Ledconfig;
  token: any;
  constructor(public service: LoginserviceService, public http: HttpClient) { }
  saveLedConfig(){
    console.log(this.ledmodal);
    this.ledmodal.token =JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.ledmodal);
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.service.url+'elw_saveledconfig',Form,httpOptions)
  }


  getLedDetails(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getledconfigdetails?token=' + this.token);
  }
  changeLEDStatus(data:Ledconfig){
    let Data= JSON.stringify(data)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.service.url+'elw_ledstatuschange', Data,httpOptions1);
    }

    updateLedConfig(data:Ledconfig){
 
      data.token= JSON.parse(localStorage.getItem('access_token'));
      let Data= JSON.stringify(data)
        const httpOptions1 = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
            
          })
        };
        return this.http.post(this.service.url+'elw_updateledconfig', Data,httpOptions1);
      }
}
