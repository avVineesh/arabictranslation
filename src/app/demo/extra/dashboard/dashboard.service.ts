import { Injectable } from '@angular/core';
import { LoginserviceService } from '../login/loginservice.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  token: any;
  orgid:any;
  id:any;
  isorg:any;
  isendpoint:any;
  vehno: any;
  date:any;
  todate:any;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getUsedCount(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkedcount?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate );
  }
  getAllCollection(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getallcollection?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate );
  }
  getParkingSpace(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkingspacefordashboard?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg );
  }

  getMostCollectedParkingspace(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getmostcollectedparkingspce?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
  }
  getParkedVehicles(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkedvehfordashboard?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg);
  }
  getAgencyTotal(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getagencytotal?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
  }
  updateBlacklistedVeh(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_updateblacklistedveh?token=' + this.token+ '&vehno='+this.vehno);
  }
  getParkingSpaceOccupancy(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkingspaeoccupancyfordashboard?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg);
  }
   getParkingspacelist(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkspacelist?token=' + this.token);
  }
}
