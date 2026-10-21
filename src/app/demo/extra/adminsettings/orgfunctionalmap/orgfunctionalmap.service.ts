import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrgfunctionalmapService {
  token: any;
  orgid: string;

  constructor(public http:HttpClient, public service:LoginserviceService) { }
  getOrgFunctionalMap(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_orgfunctionalmap?token=' + this.token );
  }
  getStaffUnderOrg(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_stafffortree?token=' + this.token +'&orgid='+this.orgid);
  }
  allStaffWithOrg(){
    this.token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getallstaffwithorganization?token=' + this.token);
  }
}
