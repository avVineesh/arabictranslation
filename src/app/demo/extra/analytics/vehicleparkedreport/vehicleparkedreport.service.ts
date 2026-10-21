import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../login/loginservice.service';
import { Areafilter, Filterdata } from './vehicleparkedreport.modal';
@Injectable({
  providedIn: 'root'
})
export class VehicleparkedService {
  token: any;
  orgid: any;
  filterdata: Filterdata;
  lotid: any;
  id: any;
  isorg: number;
  isendpoint: number;
  date: any;
  todate: string;
  entryexit:any;
  constructor(public http: HttpClient, public service: LoginserviceService) { }
  GetParkedVehicleReport() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    this.orgid = JSON.parse(localStorage.getItem('orgid'));
    return this.http.get(this.service.url + 'elw_vehicleparkedhours?token=' + this.token);

  }
/* Report for unbilled ANPR entry in Parking Area Report */
  GetUnbilledParkedVehicleReport() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_unbilledparkedvehicles?token=' + this.token +  '&id=' + this.id + '&isorg=' + this.isorg + '&date=' + this.date + '&todate=' + this.todate);
  }
  getUnbilledExitVehicles() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_unbilledexitvehicles?token=' + this.token +  '&id=' + this.id + '&isorg=' + this.isorg + '&date=' + this.date + '&todate=' + this.todate);
  }
  GetParkingAreaList() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkspacelist?token=' + this.token);
  }
  GetAreaReport(data: Areafilter) {
    data.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_vehicleparkedhours?token=' + data.token + '&parking_lot_id=' + data.parking_lot_id);
  }
  filterparkingAreaData() {
    this.filterdata.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.filterdata);
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.service.url + 'elw_filterparkingareareport', Form, httpOptions1);
  }
  // For cial getting parkingspace log............................................................................................................................
  cialReport(data: Areafilter) {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_cialparkinglog?token=' + this.token + '&id=' + this.id + '&isorg=' + this.isorg + '&date=' + this.date + '&todate=' + this.todate+ '&entryexit=' + this.entryexit);
  }
  getDetailedLog() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_cialdetailedlog?token=' + this.token + '&lotid=' + this.lotid);
  }
  getOrgList() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getorglistfordashboard?token=' + this.token + '&orgid=' + this.orgid);
  }
  getSummary() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.service.url + 'elw_getparkinglogentrysummary?token=' + this.token + '&id=' + this.id + '&isorg=' + this.isorg + '&date=' + this.date + '&todate=' + this.todate+ '&entryexit=' + this.entryexit);
  }
}
