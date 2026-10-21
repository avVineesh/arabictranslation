import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settariff } from './settariff.modal';

@Injectable({
  providedIn: 'root'
})
export class SettariffService {
  AddTariff?: boolean;
  ViewTariff?: boolean;
  token: any;
  public schemedefinition: Settariff;
  schmedata: Settariff;
  parkingspaceid: any;
  parkingspacelotavailid:any;
  orgid: string;
  constructor(public urlservice: LoginserviceService, public http: HttpClient) { }
  getTariffDefenition() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_gettariffdef?token=' + this.token);
  }
  getTariff() {
    this.token = JSON.parse(localStorage.getItem('access_token'));

    return this.http.get(this.urlservice.url + 'elw_gettariffdetails?token=' + this.token);
  }
  saveTariffSchemedata() {
    this.schemedefinition.token = JSON.parse(localStorage.getItem('access_token'));
    // this.schemedefinition.tariff=JSON.parse(localStorage.getItem('schemevalues'));

    let Form = JSON.stringify(this.schemedefinition)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.urlservice.url + 'elw_savetariff', Form, httpOptions);
  }
  assignParkingSpace(parkSpace: string[], tariffid: string, parkSpace1: string[]) {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_tariffassign_v1?token=' + this.token + '&tariffid=' + tariffid + '&uparkingspaceid=' + parkSpace1 + '&parkingspaceid=' + parkSpace);
  }
  getparkAssign(tariffid: string) {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkassign?token=' + this.token + '&tariffid=' + tariffid);
  }
  changeStatus(Data: any) {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_changetariffstatus?token=' + this.token + '&tariffid=' + Data.tariffid + '&isactive=' + Data.isactive);
  }
  getEndPointUnderme() {
    this.token = JSON.parse(localStorage.getItem('access_token'));

    return this.http.get(this.urlservice.url + 'elw_getendpointorgsunderme?token=' + this.token);
  }
  getParkingSpaces(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getparkspace?token=' + this.token + '&orgid=' + this.orgid);
  }
 parkingLotsAvial(){
   this.token = JSON.parse(localStorage.getItem('access_token'));
   return this.http.get(this.urlservice.url + 'elw_parkinglotsavail?token=' + this.token + '&parkingspaceid=' + this.parkingspacelotavailid);
 }
}
