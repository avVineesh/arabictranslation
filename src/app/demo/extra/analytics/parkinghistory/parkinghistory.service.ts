import { Injectable } from '@angular/core';
import { Parkinghistory } from './parkinghistory.modal';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParkinghistoryService {
   token: any;
    historymodal:Parkinghistory;
    orgid: any;
    id: any;
    isendpoint: number;
    isorg: number;
    status: string;
    date: string;
    todate:string;
    mode:any;
    vehno:any;
  constructor(public service:LoginserviceService, public http: HttpClient) { }
  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getParkingspacelist(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkspacelist?token=' + this.token);
  }
  getHistory(){
    var token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getvehiclehistory?token='+token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate+ '&vehno='+this.vehno);
 }
}
