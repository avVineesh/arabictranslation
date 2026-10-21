import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { Saffmodel, StaffPriv, StaffStatusCheck } from './staff.modal';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  AddStaffSer?:boolean;
  EditStaffSer?:boolean;
  StaffPriv?:boolean;
  orgid:string;
  token1:string;
  staffdata:Saffmodel;
  hierarchyid:string;
  constructor(public http:HttpClient,public service:LoginserviceService) { }
  GetData(){ 

    this.token1=JSON.parse(localStorage.getItem('access_token'));
    this.orgid = JSON.parse(localStorage.getItem('orgid'));  
    return this.http.get(this.service.url+'elw_getstaff?token='+ this.token1 +'&orgid='+this.orgid);
    }

  StaffStatus(staffstatus:StaffStatusCheck){

    staffstatus.token=JSON.parse(localStorage.getItem('access_token'));
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };   
     return this.http.post(this.service.url+'changestaffstatus',staffstatus,httpOptions);
    }

    StaffMobileStatus(staffstatus:Saffmodel){
      
      staffstatus.token=JSON.parse(localStorage.getItem('access_token'));
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };   
     
     return this.http.post(this.service.url+'elw_changemobileuser',staffstatus,httpOptions);
    }
  
AddStaffservice(){

  this.staffdata.token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(this.staffdata);
 
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'      
    })
  };      
  return this.http.post(this.service.url+'elw_savestaff',Form,httpOptions);
}

OnUpdateSer(stafflist2:Saffmodel){
  
  stafflist2.token=JSON.parse(localStorage.getItem('access_token'));
  stafflist2.type="update"
  let Form = JSON.stringify(stafflist2);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_updatestaff',Form,httpOptions);
}

AddStaffPriv(StaffPriData:StaffPriv){

StaffPriData.Token=JSON.parse(localStorage.getItem('access_token'));
  let Form = JSON.stringify(StaffPriData);
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      
    })
  };   
 return this.http.post(this.service.url+'elw_savestaffprivileges',Form,httpOptions);

}
getStaffOrgid(){ 

  this.token1=JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url+'elw_getstafforgid?token='+ this.token1 +'&orgid='+this.orgid+'&hierarchyid='+this.hierarchyid);
  }
}
