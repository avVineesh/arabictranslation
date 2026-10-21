import { Injectable } from '@angular/core';
import {Camera} from './camera.modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class CameraService {
cameramodal: Camera;
  token: any;
  camid:any;
  lotid:any;
  constructor(public urlservice:LoginserviceService, public http: HttpClient) { }


  getClusterDet(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getclusterdet?token=' + this.token);
  }
  saveCameraDet(){

    this.cameramodal.token =JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.cameramodal);
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.urlservice.url+'elw_savecamera',Form,httpOptions);
  }
  getCameraDet(){
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getcameradet?token=' + this.token+'&lotid='+this.lotid);
  }

  changeCamStatus(data:Camera){
    data.token= JSON.parse(localStorage.getItem('access_token'));
    let Data= JSON.stringify(data)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.urlservice.url+'elw_changecamstatus', Data,httpOptions1);
    }
    getCamImage(){
      this.token = JSON.parse(localStorage.getItem('access_token'));
      return this.http.get(this.urlservice.url + 'elw_getcamimage?token=' + this.token+'&id='+this.camid);
    }
    updateCamera(editdata:Camera){
          editdata.token = JSON.parse(localStorage.getItem('access_token'));
          let Data= JSON.stringify(editdata)
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.urlservice.url+'elw_updatecamera', Data,httpOptions1);
    }
}
