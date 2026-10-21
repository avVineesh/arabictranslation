import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Park, Parkingarea } from './parkingarea.modal';
import { LoginserviceService } from '../../login/loginservice.service';
import { Observable } from 'rxjs';
// import {AngularFireAuth} from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class ParkingareaService {
  ParkArea:Parkingarea;
  AddParkArea?:boolean;
  EditParkArea?:boolean;
  PExtra?:boolean;
  token: any;
  orgid: any;
  tarifflisttoken: any;
  parkingspaceid:any;
  id: any;
  isorg: number;
  isendpoint: number;
  date:any;
  // authState: any = null;
  constructor(public http:HttpClient,public service:LoginserviceService) { 
    // this.afAuth.authState.subscribe((auth) => {
    //   this.authState = auth
    // });
  }
  


  // get isUserAnonymousLoggedIn(): boolean {
  //   return (this.authState !== null) ? this.authState.isAnonymous : false
  // }
 
  // get currentUserId(): string {
  //   return (this.authState !== null) ? this.authState.uid : '';
  // }
 
  // anonymousLogin() {
  //   return this.afAuth.auth.signInAnonymously()
  //     .then((user) => {
  //       this.authState = user
  //     })
  //     .catch(error => console.log(error));
  // }


  OnGetPAreaSer(){

     this.token=JSON.parse(localStorage.getItem('access_token'));
     this.orgid = JSON.parse(localStorage.getItem('orgid'));  
    
    return this.http.get(this.service.url+'elw_getparkingspace?token='+ this.token +'&orgid='+this.orgid);
  }

  OnGetPAreaSettingSer(){

    this.token=JSON.parse(localStorage.getItem('access_token'));  
    this.orgid = JSON.parse(localStorage.getItem('orgid')); 
   return this.http.get(this.service.url+'elw_getparkingspacesettings?token='+ this.token+ '&id='+this.id+ '&isorg='+this.isorg);
 }

 OnGetAwsSetting(){
  this.token=JSON.parse(localStorage.getItem('access_token'));  
  this.orgid = JSON.parse(localStorage.getItem('orgid')); 
 return this.http.get(this.service.url+'elw_getparkingspacesettings?token='+ this.token+'&orgid='+this.orgid);
}

 OnStaffAssign(parkstaff:string[],parking_lot_id:string,parkstaff1:string[]){

  this.token=JSON.parse(localStorage.getItem('access_token'));  
    return this.http.get(this.service.url+'elw_saveparkassignstaff?token='+ this.token+'&parking_lot_id='+parking_lot_id+'&parkstaff='+parkstaff+'&parkstaff1='+parkstaff1);
 
}

//elw_saveparkassignstaff
  OnAddPAreaSer(){
    this.ParkArea.token=JSON.parse(localStorage.getItem('access_token'));

    let Form = JSON.stringify( this.ParkArea);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.service.url+'saveparkingspace ',Form,httpOptions);

  }

  OnChageStatusPArea(ParkAreaChange:Parkingarea){

    ParkAreaChange.token=JSON.parse(localStorage.getItem('access_token'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   return this.http.post(this.service.url+'changeparkingspacestatus',ParkAreaChange,httpOptions);   
  }


  OnUpdatePASer(ParkAreaEdit:Parkingarea){

    ParkAreaEdit.token=JSON.parse(localStorage.getItem('access_token'));
    ParkAreaEdit.type="update"
    let Form = JSON.stringify(ParkAreaEdit);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   return this.http.post(this.service.url+'saveparkingspace',Form,httpOptions);
  }

  OnGetStaff(parking_lot_id:string){
    this.token=JSON.parse(localStorage.getItem('access_token'));  
   
    return this.http.get(this.service.url+'elw_getparkassignstaff?token='+ this.token+'&parking_lot_id='+parking_lot_id);
  }


OnParkSetting(park:Park){
park.Token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(park);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };  
  return this.http.post(this.service.url+'elw_saveparkingspacesettings',Form,httpOptions);
}
ogUnderme(){
  this.token=JSON.parse(localStorage.getItem('access_token'));  
 
  return this.http.get(this.service.url+'elw_getendpointorgsunderme?token='+ this.token);
}
TariffList(){
  this.tarifflisttoken = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_tarifflist?token='+ this.tarifflisttoken+'&parkingspaceid='+this.parkingspaceid);
}
boombarrierList(){
  var token = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_getboombarrierlist?token='+ token+'&parkingspaceid='+this.parkingspaceid);
}
displaylist(){
  var token = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_getdisplaylist?token='+ token+'&parkingspaceid='+this.parkingspaceid);
}
getOrgList(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token+ '&orgid='+this.orgid);
  }
  getDisabledDate(){
  var token = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_getbookingdisableddate?token='+ token+'&parkingspaceid='+this.parkingspaceid);
}
 addDisabledDate(){
  var token = JSON.parse(localStorage.getItem('access_token')); 
  return this.http.get(this.service.url+'elw_addbookingdisableddate?token='+ token+'&parkingspaceid='+this.parkingspaceid+ '&date='+this.date);
}
}
