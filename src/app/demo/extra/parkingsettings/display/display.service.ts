import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Display} from './display.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  token: any;
  displaydata:Display;
  add?:boolean;
  edit?:boolean;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  getDisplayDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getdisplaydetails?token=' + this.token);
  }
  addDisplayDetails(){

    this.displaydata.token =JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.displaydata);
   console.log(Form);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.urlservice.url+'elw_savedisplaydata',Form,httpOptions);
  }
  changeDisplayStatus(data:Display){
 

    let Data= JSON.stringify(data)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.urlservice.url+'elw_changedisplaystatus', Data,httpOptions1);
    }
    updateDisplay(data:Display){
 
      data.token= JSON.parse(localStorage.getItem('access_token'));
      let Data= JSON.stringify(data)
        const httpOptions1 = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
            
          })
        };
        return this.http.post(this.urlservice.url+'elw_updatedisplay', Data,httpOptions1);
      }
}
