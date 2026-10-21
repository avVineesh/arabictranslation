import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Cameraplot} from './cameraplot.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class CameraplotService {
camid:any;
  token: any;
  plotmodal:Cameraplot;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }
  
  getCamImage(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getcamimage?token=' + this.token+'&id='+this.camid);
  }
  saveCameraCoordinates(){

    this.plotmodal.token =JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.plotmodal);
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.urlservice.url+'elw_savecameraplot',Form,httpOptions);
  }
}
