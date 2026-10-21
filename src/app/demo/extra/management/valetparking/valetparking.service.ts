import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class ValetdetailsService {
  date:any;
  constructor(public http: HttpClient,public service:LoginserviceService) { }
  getValetDetails(){
    var token= JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url+'elw_getvaletdetails?token='+token);
 }
 filterValetDetails(){
  var token= JSON.parse(localStorage.getItem('access_token'));
  return this.http.get(this.service.url+'elw_filtervalet?token='+token+'&date='+this.date);
}
}
