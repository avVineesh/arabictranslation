import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Parkinglots, BulkParkLotUpload, BulkDeviceAllocation, CountSlot, SelectDevice,Layout, Cluster } from './parkinglots.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class ParkinglotsService {
  AddParkLotSer?:boolean;
  EditParkLotSer?:boolean;
  AddParkLot:Parkinglots;
  BulkdeviceAssign:BulkDeviceAllocation;
  Token:string;
  OrgId:string;
  lotsid:string;
  token: any;
  slotcount:CountSlot;
  selectdevice:SelectDevice;
  layoutmodal:Layout;
  clustermodal:Cluster;
  lotid:any;
  clusterid:any;
  constructor(public http:HttpClient,public service:LoginserviceService) { }


  OnGetPLotSer(){

    this.Token=JSON.parse(localStorage.getItem('access_token'));
  
    return this.http.get(this.service.url+'elw_getparkinglot?token='+ this.Token+'&orgid='+this.lotsid);
   
  }


  OnAddPLotSer(){
    this.AddParkLot.token=JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.AddParkLot);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.service.url+'elw_addparkinglot',Form,httpOptions);

  }

  OnChangeStatusPLot(Plot:Parkinglots){
   
    Plot.token=JSON.parse(localStorage.getItem('access_token'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   return this.http.post(this.service.url+'elw_changeparkinglotstatus',Plot,httpOptions);
}


OnBulkPLotSer(BPLot:BulkParkLotUpload){

  BPLot.Token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(BPLot);

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_savebulkparkinglot',Form,httpOptions);
}


OnGetParkAreaOnly(ParkData:Parkinglots){

  ParkData.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(ParkData);

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_getparkreport',Form,httpOptions);
}

OnUpdateparkingSlots(slotdata:Parkinglots){
  slotdata.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(slotdata);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_updateparkingslot',Form,httpOptions);
}
autoAssignSensortoLot(){
  this.BulkdeviceAssign.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(this.BulkdeviceAssign);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'      
    })
  };      
  return this.http.post(this.service.url+'elw_sensorsutoassign',Form,httpOptions);

}

getdeviceUnderNetwork(){

  this.token=JSON.parse(localStorage.getItem('access_token'));

  return this.http.get(this.service.url+'elw_getsensorinnetwork?token='+ this.token+'&networkid='+this.BulkdeviceAssign.networkid);
 
}
countParkingSlot(){
  this.slotcount.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(this.slotcount);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_checkparkingslot',Form,httpOptions);
}
getSensorOnParkingSlot(){
  this.token = JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url+'elw_getsensoronparkingslot?token='+ this.token+'&parkingspaceid='+this.selectdevice.parkingspaceid+'&parkingslotid='+this.selectdevice.parkingslotid);
}

autoSensortoCheckedSlots(){
  this.BulkdeviceAssign.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(this.BulkdeviceAssign);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'      
    })
  };      
  return this.http.post(this.service.url+'elw_checkedslotssensorassign',Form,httpOptions);

}

saveLayout(){
  this.layoutmodal.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(this.layoutmodal);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'      
    })
  };      
  return this.http.post(this.service.url+'elw_saveparkingspacelayout',Form,httpOptions);

}
createCluster(){//api call for creating cluster 
  this.clustermodal.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(this.clustermodal);

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_savecluster',Form,httpOptions);
}
updateClusterID(){ // api call for updating cluster id on parking lot table
  console.log("hello")
  this.Token=JSON.parse(localStorage.getItem('access_token'));

  return this.http.get(this.service.url+'elw_updateclusterid?token='+ this.Token+'&lotid='+this.lotid+'&clusterid='+this.clusterid);
 
}
GetParkingAreaList(){
    
  this.token= JSON.parse(localStorage.getItem('access_token'));
 

  return this.http.get(this.service.url+'elw_getparkspacelist?token=' +this.token);
}
}
