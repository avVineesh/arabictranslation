import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
   url= "http://localhost:8089/";

    // url= "https://web.csml.elvicto.in/"; //For smartcity staging
  privilegedata: any;
  name: any;
  constructor(private http: HttpClient) { }
  login(user:any) {
    let Form = user;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'      
      })
    };      
    return this.http.post(this.url+'stafflogincheck',Form,httpOptions);
  }
}
