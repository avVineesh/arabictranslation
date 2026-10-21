import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { AddVehicle } from './vehiclecategory.modal';

@Injectable({
  providedIn: 'root'
})
export class VehiclecategoryService {
  token: any;
  orgid: any;
  VehicleAdd:AddVehicle;
  constructor(public http: HttpClient,public service:LoginserviceService) { }
  
  GetVehicleCateory() {

    this.token = JSON.parse(localStorage.getItem('access_token'));
    this.orgid = JSON.parse(localStorage.getItem('orgid'));
    return this.http.get(this.service.url + 'getvehiclecategory?token=' + this.token +
      '&orgid=' + this.orgid);
  }
}
