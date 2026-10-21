import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { Organizationdomain } from './orgdomain.modal';
@Injectable({
  providedIn: 'root'
})
export class OrganizationdomainService {
domainData:Organizationdomain
  token: any;
  add?:boolean;
  edit?:boolean;
  constructor(public http: HttpClient, public service: LoginserviceService) { }
  getOrgDomainDetails() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorgdomain?token=' + this.token);
  }
  saveOrgDomainDetails(){
    this.domainData.token = JSON.parse(localStorage.getItem('access_token'));

    let Form = JSON.stringify(this.domainData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_saveorgdomain', Form, httpOptions);
  }
  saveBulkdomainData(data:Organizationdomain){
    data.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_saveorgdomain', Form, httpOptions);
  }

  updateDomainDetails(updatedata: Organizationdomain) {
    updatedata.token = JSON.parse(localStorage.getItem('access_token'));
    let Data = JSON.stringify(updatedata)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_updateorgdoamin', Data, httpOptions1);
  }
}
