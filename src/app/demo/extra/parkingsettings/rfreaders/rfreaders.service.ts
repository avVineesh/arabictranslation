import { Injectable } from '@angular/core';
import { LoginserviceService } from '../../login/loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rfreaders } from './rfreaders.modal';

@Injectable({
  providedIn: 'root'
})
export class RfreadersService {
  token: any;
  reader: Rfreaders
  constructor(public urlservice: LoginserviceService, public http: HttpClient) { }
  getRFReaders() {
    this.token = JSON.parse(localStorage.getItem('access_token'));
    return this.http.get(this.urlservice.url + 'elw_getreaderinfo?token=' + this.token);
  }
  saveReaderInfo() {
    this.reader.token = JSON.parse(localStorage.getItem('access_token'));
    let Form = JSON.stringify(this.reader);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.urlservice.url + 'elw_savereaderinfo', Form, httpOptions);
  }
  changeRfReaderStatus(data: Rfreaders) {


    let Data = JSON.stringify(data)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.urlservice.url + 'elw_changerfreaderstatus', Data, httpOptions1);
  }
  updateRFReader(data: Rfreaders) {

    data.token = JSON.parse(localStorage.getItem('access_token'));
    let Data = JSON.stringify(data)
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'

      })
    };
    return this.http.post(this.urlservice.url + 'elw_updaterfreaders', Data, httpOptions1);
  }
}
