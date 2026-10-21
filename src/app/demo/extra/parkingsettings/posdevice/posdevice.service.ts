import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { Posdevice } from './posdevice.modal';
@Injectable({
  providedIn: 'root'
})
export class PosdevicesService {
  token: any;
  orgid: any;
  id: any;
  isendpoint: number;
  isorg: number;
  status: string;
  posdata:Posdevice;
  constructor(public http:HttpClient,public service:LoginserviceService) { }
    getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getParkingspace(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkspacelist?token=' + this.token);
  }
   savePos(){
    
        this.posdata.token =JSON.parse(localStorage.getItem('access_token'));
        let Form = JSON.stringify(this.posdata);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'      
          })
        };      
        return this.http.post(this.service.url+'elw_saveposdetails',Form,httpOptions);
      }

       getPOSDetails(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getposdetails?token=' + this.token+'&id='+this.id+ '&isorg='+this.isorg);
  }

   changePOsStatus(data: Posdevice) {
  
  
      let Data = JSON.stringify(data)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
  
        })
      };
      return this.http.post(this.service.url + 'elw_changeposstatus', Data, httpOptions1);
    }

     updatePOS(data: Posdevice) {
  data.token= JSON.parse(localStorage.getItem('access_token'));
      let Data = JSON.stringify(data)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
  
        })
      };
      return this.http.post(this.service.url + 'elw_updateposdetails', Data, httpOptions1);
    }
}
