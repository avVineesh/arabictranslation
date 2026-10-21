import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from} from 'rxjs';
import { data, Networkmonitor } from './networkmonitoring.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class NetworkmonitorService {
  token: any;
  orgid: any;
  networkmodal:Networkmonitor;
  data:data;
  starttime:any;
  deviceid:any;
  stoptime:any;
  parkingspaceid: string;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  getNetworkLagData(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    this.orgid = JSON.parse(localStorage.getItem('orgid'));
    return this.http.get(this.urlservice.url + 'elw_networkmonitor?token=' + this.token+'&orgid='+this.orgid);
  }
  logBoombarrierNetwork(data:Networkmonitor){
    data.token= JSON.parse(localStorage.getItem('access_token'));
     let Form = JSON.stringify(data)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
     return this.http.post(this.urlservice.url+'elw_bbofflinelog', Form,httpOptions);
  }
  getbbOfflineLog(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    this.orgid = JSON.parse(localStorage.getItem('orgid'));
    return this.http.get(this.urlservice.url + 'elw_getbbofflinelog?token=' + this.token+'&orgid='+this.orgid+'&deviceid='+this.deviceid);
  }
  filterBBOfflineLog(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    this.orgid = JSON.parse(localStorage.getItem('orgid'));
    return this.http.get(this.urlservice.url + 'elw_filterbbofflinelog?token=' + this.token+'&parking_lot_id='+this.parkingspaceid+'&orgid='+this.orgid);
  }
  newMonitorLog(){
    // const url = 'https://e5700.iospace.in/uploads/watchdog.json';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  
    let x = {
      deviceid:'1010',
      password:'1010'
    }
    let form = JSON.stringify(x);
    return this.http.post('http://localhost:7704/api/dev_tvlogin', form,httpOptions).subscribe((Response)=>{
      console.log(Response);
    }, (error)=>{
      console.log(error);
    });
   
    
  }
}
