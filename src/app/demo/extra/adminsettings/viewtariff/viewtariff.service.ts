import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Viewtariff } from './viewtariff.modal';

@Injectable({
  providedIn: 'root'
})
export class ViewtariffService {
  EditTariff?: boolean;
  token: any;
  tariffid: any;
   updatetariff:Viewtariff;
  constructor(public urlservice:LoginserviceService, public http:HttpClient) { }
  getTariffDetails(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    this.tariffid= JSON.parse(localStorage.getItem('tariffid'));
    return this.http.get(this.urlservice.url+'elw_gettariff?token='+ this.token+ '&tariffid='+this.tariffid);
  }
  updateTariff(){
   this.updatetariff.token=JSON.parse(localStorage.getItem('access_token'));
   this.updatetariff.tariffid=JSON.parse(localStorage.getItem('tariffid'));
   console.log(this.updatetariff);
  //  this.updatetariff.tariff=JSON.parse(localStorage.getItem('schemevalues'));
   
   let Form = JSON.stringify(this.updatetariff)
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };
   return this.http.post(this.urlservice.url+'elw_updatetariff', Form,httpOptions);
}
getTariffDefenition(){
  this.token= JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.urlservice.url+'elw_gettariffdef?token='+ this.token);
}
}
