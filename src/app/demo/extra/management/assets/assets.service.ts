import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Assets } from './assets.modal';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  token: any;
  assetdata:Assets;
  orgid: string;
  isendpoint: number;
  isorg: any;
  id: any;
  date:any;
  todate:any;
  constructor(public service:LoginserviceService, public http: HttpClient) { }
  getItemsList(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getitemdetails?token=' + this.token);
  }
  saveAssets(){
  
      this.assetdata.token =JSON.parse(localStorage.getItem('access_token'));
      let Form = JSON.stringify(this.assetdata);
     
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'      
        })
      };      
      return this.http.post(this.service.url+'elw_saveassetdetails',Form,httpOptions);
    }
    getOrgList(){
      this.token= JSON.parse(localStorage.getItem('access_token'));
      return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
    }
    getAssetDetails(){
      this.token = JSON.parse(localStorage.getItem('access_token'));
      return this.http.get(this.service.url + 'elw_getassetsdetails?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg);
    }
    edit(editdata:Assets){
      editdata.token =JSON.parse(localStorage.getItem('access_token'));
      let Form = JSON.stringify(editdata);
     
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'      
        })
      };      
      return this.http.post(this.service.url+'elw_updateassetsdetails',Form,httpOptions);
    }
    assetsActiveSummary(){
       this.token = JSON.parse(localStorage.getItem('access_token'));
      return this.http.get(this.service.url + 'elw_getassetsactivesummary?token=' + this.token+ '&id='+this.id+ '&isorg='+this.isorg+ '&date='+this.date+ '&todate='+this.todate);
    }
}
