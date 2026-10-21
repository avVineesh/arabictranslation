import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GetVehicledetails,AddVehicledetails,OwnershipChangeModal, UpdateOwnVehicle} from './customervihicle.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class VehicledetailsService {
  token: string;
 
  addvehicle:AddVehicledetails;
  custid: any;
  vehtype:any;
  constructor(public http: HttpClient,public service:LoginserviceService) { }
  GetVehicleDetails() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getcustomervehicle?token=' + this.token+'&custid='+this.custid);
  }
  ChangeOwnVehicleStatus(VehicleDetails:GetVehicledetails){

    let Data= JSON.stringify(VehicleDetails)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.service.url+'elw_changeownvehiclestatus', Data,httpOptions1);
    }

    //API for adding vehicle for Customers
    AddOwnVehicle(){
      this.addvehicle.token=JSON.parse(localStorage.getItem('access_token'));
      let Form= JSON.stringify(this.addvehicle);
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'

  })
};
return this.http.post(this.service.url+'elw_addcustomerveh', Form, httpOptions);
}
OnUpdateVehicle(vehicledata:UpdateOwnVehicle){
  vehicledata.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(vehicledata);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_updateownstaffveh',Form,httpOptions);
}


// API for changing the ownership of a vehicle 
changeOwnership(Data:OwnershipChangeModal){
  let Form = JSON.stringify(Data);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
  
    })
  }; 
  return this.http.post(this.service.url+'elw_changeownership', Form, httpOptions);
}
getVehSegment() {
  this.token = JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url+'elw_getvehsegment?token=' + this.token+'&vehtype='+this.vehtype);
}
}
