import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AssetsmapviewService {
  token: any;
  parking_lot_id:any;
  isendpoint: number;
  isorg: number;
  orgid: any;
  id: any;
  constructor(public service:LoginserviceService, public http: HttpClient) {

   }
   getParkingSpacelist(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getmapparkingspaces?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg);
  }
  getParkingspaceDetails(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkingspaecountandassets?token=' + this.token+ '&parking_lot_id='+this.parking_lot_id);
  }
  getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
}
