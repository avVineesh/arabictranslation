import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceregisterService {
 token: any;
  orgid: string;
  isendpoint: number;
  isorg: any;
  id: any;
  date: any;
  todate: any;
  constructor(public service:LoginserviceService, public http: HttpClient) { }
   getOrgList(){
      this.token= JSON.parse(localStorage.getItem('access_token'));
      return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
    }
     getParkingspacelist(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkspacelist?token=' + this.token);
  }
  getAttendance(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getstaffattendance?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+'&date='+this.date+'&todate='+this.todate);
  }
}
