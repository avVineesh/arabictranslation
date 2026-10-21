import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { Organization } from './orgtype.modal';

@Injectable({
  providedIn: 'root'
})
export class OrgtypeService {

  constructor(public http: HttpClient, public service:LoginserviceService) { }
  token: any;
  OrgModal:Organization
  addorgtype?:boolean;
  GetOrganizationType() {

    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorgtypelist?token=' + this.token );
  }
  SaveOrganizationType(){
    this.OrgModal.token= JSON.parse(localStorage.getItem('access_token'));
    let form = JSON.stringify(this.OrgModal);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
        
      })
    };   
   
   return this.http.post(this.service.url+'elw_saveorgtype',form,httpOptions);
  }
}
