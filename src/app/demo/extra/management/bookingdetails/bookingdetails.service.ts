import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Bookingdetails} from './bookingdetails.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class BookingdetailsService {
  token: any;
  bookingdata:Bookingdetails;
  bookingid:any;
  type:any;
  constructor(public service: LoginserviceService, public http: HttpClient) { }
  getBookingDetails() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getbookingdata?token=' + this.token);
  }
  getFilteredData(){
    this.bookingdata.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.bookingdata);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json' 
        
      })
    };
    return this.http.post(this.service.url+'elw_filterbookingdata', Form,httpOptions1 );
  }
}
