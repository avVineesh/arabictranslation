import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { BankDetails, Orgprofile, OrgSettings, OrgUpdate } from './orgprofile.modal';
@Injectable({
  providedIn: 'root'
})
export class OrgprofileService {
  orgadd:Orgprofile;
  orgid: string;
  token: string;
  orglist2: OrgUpdate;
  FormData: OrgSettings;
  authState: any = null;
  EditOrgP?:boolean;
  AddOrgP?:boolean;
  EditP?:boolean;
  orgsettingsid:string;
  orgidunder:string;
  hierarchyid:string;
  Role=localStorage.getItem("rolename");
  constructor(public http: HttpClient, public service:LoginserviceService) { 
    let StaffPriData=JSON.parse(localStorage.getItem('privilege'));
    let data=StaffPriData.Privileges;
    let adminsetting=data[0]["AdminSetting"];
    this.EditP=adminsetting.OrgProf.Edit;
    this.AddOrgP = adminsetting.OrgProf.Create;
  }
  GetOrgprofile(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    this.orgid=JSON.parse(localStorage.getItem('orgid'));

    return this.http.get(this.service.url+'elw_getOrganization?token=' +this.token+
          '&orgid='+this.orgid);
  }
  OnUpdateOrg(orglist2:OrgUpdate){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
    return this.http.post(this.service.url+'elw_updateorganization', orglist2,httpOptions);
  }
  GetOrganizationSettings(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getorgsettings?token=' +this.token+
    '&orgid='+this.orgsettingsid);
  }
  PostOrganizationSettings(FormData:OrgSettings){
    this.FormData.token=JSON.parse(localStorage.getItem('access_token'));
    this.FormData.orgid = this.orgsettingsid;
     let Form = JSON.stringify(this.FormData)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
     return this.http.post(this.service.url+'elw_saveorgsettings', Form,httpOptions);
  }
  saveOrganization(){
    this.orgadd.token = JSON.parse(localStorage.getItem('access_token'));
    this.orgadd.orgid = JSON.parse(localStorage.getItem('orgid'));
    let form = JSON.stringify(this.orgadd);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
    return this.http.post(this.service.url+'elw_saveOrganization', form,httpOptions);
  }

  GetOrganizationUnderId(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getorgsunderid?token=' +this.token+
    '&orgid='+this.orgidunder+ '&hierarchyid=' +this.hierarchyid);
  }
  saveBankDetails(formdata:BankDetails){
    formdata.token=JSON.parse(localStorage.getItem('access_token'));
    
    let Form = JSON.stringify(formdata)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };
     return this.http.post(this.service.url+'elw_savebankdetails', Form,httpOptions);
  }
  getBankDetails(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getbankdetails?token=' +this.token+
    '&orgid='+this.orgsettingsid);
  }
}
