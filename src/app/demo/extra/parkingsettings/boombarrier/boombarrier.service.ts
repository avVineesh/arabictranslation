import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Boombarrier} from './boombarrier.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class BoombarrierService {
  token: any;
  boombarrierdata:Boombarrier;
  orgid: any;
  add?:boolean;
  edit?:boolean;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  getBoombarrierDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getboombarrierdet?token=' + this.token);
  }
  addBoombarrier(){

    this.boombarrierdata.token =JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.boombarrierdata);
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.urlservice.url+'elw_saveboombarrier',Form,httpOptions);
  }
  changeBoombarrierStatus(data:Boombarrier){
 

    let Data= JSON.stringify(data)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.urlservice.url+'elw_changeboombarrierstatus', Data,httpOptions1);
    }
    updateBoombarrier(data:Boombarrier){
 
      data.token= JSON.parse(localStorage.getItem('access_token'));
      let Data= JSON.stringify(data)
        const httpOptions1 = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
            
          })
        };
        return this.http.post(this.urlservice.url+'elw_updateboombarrier', Data,httpOptions1);
      }

      assignParkingSpace(parkSpace: string[], boombarrierid: string, parkSpace1: string[]) {
        this.token = JSON.parse(localStorage.getItem('access_token'));
        return this.http.get(this.urlservice.url + 'elw_boombarrierassign_check?token=' + this.token + '&boombarrierid=' + boombarrierid + '&uparkingspaceid=' + parkSpace1 + '&parkingspaceid=' + parkSpace);
      }

      getBBtoParkAssign(boombarrierid: string) {
        this.token = JSON.parse(localStorage.getItem('access_token'));
        return this.http.get(this.urlservice.url + 'elw_getbbtoparkassign?token=' + this.token + '&boombarrierid=' + boombarrierid);
      }
}
