import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NetworkmonitorService } from './networkmonitoring.service';
@Component({
  selector: 'app-networkmonitoring',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule
  ],
  templateUrl: './networkmonitoring.component.html',
  styleUrl: './networkmonitoring.component.scss'
})
export default class NetworkmonitoringComponent implements OnInit {
  data: any;
  offlinedata: any;
  parkingarea: any;
  indexdata: any[];
  laststoptime: any;
  iddevice = '1010';
  pas = '1010';
  constructor(public service: NetworkmonitorService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService,public modalService: NgbModal) {

  }

  ngOnInit() {
    this.neMonitor();
    this.getNetworkLag();
    // this.getBBOfflineLog();
    this.resetform();
  }
  viewModal(view: ElementRef) {
    this.modalService.open(view, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.networkmodal = {
      boombarriername: "",
      createddate: "",
      deviceid: "",
      fetchingtime: "",
      parkingspaceid: "",
      token: ""
    },
    this.service.data = {
      deviceid: "",
      password: ""
    }
  }
  ngOnDestroy() {
    this.getNetworkLag();
  }
  getNetworkLag() {
    this.spinner.show();
    this.service.getNetworkLagData().subscribe((Response) => {
      let getlogcode = Response["Response"][0][0]["_logcode"];
      if (getlogcode == '2280') {
        this.data = Response["Response"][1];
        this.parkingarea = Response["Response"][2];
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i]["fetchingtime"] == 1) {
            this.data[i]["laststoptime"] = this.data[i]["createddate"];
          }
        }
        $('#mytable1').DataTable().destroy();
        this.datatable();
        this.spinner.hide();
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
        this.spinner.hide();
      }
    });
    
  }
  datatable() {
    $('#mytable1').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable1').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  filterBBOffline() {
    this.spinner.show();
    this.service.filterBBOfflineLog().subscribe((Response) => {
      let filterlog = Response["Response"][0][0]["_logcode"];
      if (filterlog == '2310') {
        $('#mytable1').DataTable().destroy();
        this.data = Response["Response"][1];
        this.datatable();
        this.spinner.hide();
      }
    })
  }
  getParkingArea(event: any) {
    this.service.parkingspaceid = event.target.value
  }
  getIndex(i: any) {
    this.indexdata = Array(this.data[i]);
    this.service.deviceid= this.indexdata[0]["deviceid"];
  }
  getDetailedLog(){
    this.service.getbbOfflineLog().subscribe((Response)=>{
    });
  }
  neMonitor(){
    console.log('Component');
    this.service.newMonitorLog()
    
  }
}
