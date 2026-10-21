import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddCustomerDetails, EmployeeBulkUpload, GetCustomerdetails } from './customerdetails.modal';
import { LoginserviceService } from '../../login/loginservice.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerdetailsService {
  token: string;
  addCustomer: AddCustomerDetails;
  bulkEmployee: EmployeeBulkUpload;
  edit?: boolean;
  constructor(public http: HttpClient, public service: LoginserviceService) { }
  GetCustomerDetails() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getcustomer?token=' + this.token);
  }
  AddCustomerDetails() {
    this.addCustomer.type = '0';
    this.addCustomer.token = JSON.parse(localStorage.getItem('access_token'));

    let Form = JSON.stringify(this.addCustomer);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_saveusers', Form, httpOptions);
  }
  ChangeCustomerStatus(CustomerDetails: GetCustomerdetails) {


    let Data = JSON.stringify(CustomerDetails)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_changeuserstatus', Data, httpOptions1);
  }
  updateCustomer(customerlist: GetCustomerdetails) {
    customerlist.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(customerlist);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_updatecustomer', Form, httpOptions);
  }

  getOwnUsers() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getownusers?token=' + this.token);
  }
  getAllVehicleList() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getallvehiclelist?token=' + this.token);
  }
  changeownUserStatus(data: AddCustomerDetails) {


    let Data = JSON.stringify(data)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_changeownuserstatus', Data, httpOptions1);
  }
  updateOwnUsers(updatedata: AddCustomerDetails) {
    updatedata.token = JSON.parse(localStorage.getItem('access_token'));
    let Data = JSON.stringify(updatedata)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_updateownuser', Data, httpOptions1);
  }

  changeTagStatus(data: AddCustomerDetails) {


    let Data = JSON.stringify(data)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_tagstatuschange', Data, httpOptions1);
  }
  addBulEmployeeDetails(data: EmployeeBulkUpload) {
    data.type = '1';
    data.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_saveusers', Form, httpOptions);
  }
}

