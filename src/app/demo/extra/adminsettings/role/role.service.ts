import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { GetUserRole, Userrole,RolePriv } from './role.modal';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  orgid: string;
  token:string;
  FormData: Userrole;
  privilegedata:GetUserRole;
  RoleAdSer?:boolean;
  RoleEdSer?:boolean;
  RolePriv?:boolean;
  
  s:string;
  constructor(public http: HttpClient,public service:LoginserviceService) { }
  PostUserRole(FormData:Userrole){
    this.FormData.token=JSON.parse(localStorage.getItem('access_token'));
    this.FormData.orgid=JSON.parse(localStorage.getItem('orgid'));
     let Form = JSON.stringify(this.FormData)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
     return this.http.post(this.service.url+'elw_saverole', Form,httpOptions);
  }
  GetUserRole(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    this.orgid= JSON.parse(localStorage.getItem('orgid'));

    return this.http.get(this.service.url+'elw_getrole?token=' +this.token+
          '&orgid='+this.orgid);
  }
  OnUpdateRole(roledata:GetUserRole){
    roledata.token=JSON.parse(localStorage.getItem('access_token'));
    roledata.type="update"
    let Form = JSON.stringify(roledata);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   return this.http.post(this.service.url+'elw_saverole',Form,httpOptions);
  }
  ChangeRoleStatus(rolestatusdata:GetUserRole){
    let Data= JSON.stringify(rolestatusdata)
     
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
          
        })
      };
      return this.http.post(this.service.url+'elw_changerolestatus',Data,httpOptions1);
    }


    OnSaveRolePrivilege(RolePriv:RolePriv){
     
      RolePriv.Token=JSON.parse(localStorage.getItem('access_token'));
     let Form = JSON.stringify(RolePriv);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
     return this.http.post(this.service.url+'elw_saveroleprivileges', Form,httpOptions);
    }
}
