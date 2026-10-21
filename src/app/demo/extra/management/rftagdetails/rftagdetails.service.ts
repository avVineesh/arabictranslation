import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { Employeetag } from './rftagdetails.modal';

@Injectable({
  providedIn: 'root'
})
export class EmployeetagService {
  add?: boolean;
  edit?: boolean;
  token: any;
  rfTagData: Employeetag;
  constructor(public urlservice: LoginserviceService, public http: HttpClient) { }
  getRFtagDetails() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getrftagdetails?token=' + this.token);
  }

  changeTagStatus(data: Employeetag) {
    data.token = JSON.parse(localStorage.getItem('access_token'));
    let Data = JSON.stringify(data)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.urlservice.url + 'elw_changerftagstatus', Data, httpOptions1);
  }

  saveRFTagDetails(details: Employeetag){
      details.token = JSON.parse(localStorage.getItem('access_token'));
      console.log(details);
      let Data = JSON.stringify(details);
      const httpOptions1 = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
  
        })
      };
      return this.http.post(this.urlservice.url + 'elw_saverftagdetails', Data, httpOptions1);
  }
}
