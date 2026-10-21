import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class RefundsService {
  token: any;
  filterdate:any;
  parkingspaceid:any;
  refundid:any;
  status:any;
  constructor(public service:LoginserviceService, public http:HttpClient) { }
  getRefundDetails(){
    this.token =  JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getrefunddetails?token=' + this.token);
  }
  getFiltereddata(){
    this.token =  JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_filterrefunddata?token=' + this.token+'&parkingspaceid='+this.parkingspaceid
    +'&filterdate='+this.filterdate+'&status='+this.status);
  }
  changeRefundStatus(){
    this.token =  JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_changerefundstatus?token=' + this.token+'&id='+this.refundid);
  }
}
