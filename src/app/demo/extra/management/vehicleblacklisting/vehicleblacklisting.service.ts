import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { Vehicleblacklisting } from './vehicleblacklisting.modal';

@Injectable({
  providedIn: 'root'
})
export class VehicleblacklistingService {
  token:any;
  vehicledata: Vehicleblacklisting;
constructor(public urlservice: LoginserviceService, public http: HttpClient) { }

  saveVehicleDetails(details: Vehicleblacklisting) {
    details.token = JSON.parse(localStorage.getItem('access_token'));
    console.log(details);
    let Data = JSON.stringify(details);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.urlservice.url + 'elw_saveblvehicledetails', Data, httpOptions1);
  }

  getblvehicleDetails() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getblvehicledetails?token=' + this.token);
  }
}
