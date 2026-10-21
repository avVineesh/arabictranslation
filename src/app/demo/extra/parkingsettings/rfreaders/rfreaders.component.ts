import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RfreadersService } from './rfreaders.service';
import { ParkingareaService } from '../parkingarea/parkingarea.service';
import { Rfreaders } from './rfreaders.modal';
@Component({
  selector: 'app-rfreaders',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule,
    RouterModule
  ],
  templateUrl: './rfreaders.component.html',
  styleUrl: './rfreaders.component.scss'
})
export default class RfreadersComponent implements OnInit {
  data: any;
  parkingarea: any;
  boombarrierlist: any;
  dataindex: any[];
  constructor(public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService, public modalService: NgbModal, public service: RfreadersService, public paservice: ParkingareaService) { }
  ngOnInit() {
    this.getInfo();
    this.resetform();
  }
  addModal(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  editData(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.reader = {
      plazaid: "",
      id: "",
      token: "",
      fulldetails: "",
      deviceid: "",
      lane: "",
      parking_lot_id: "",
      topic: "",
      isactive: "",
      macid: "",
    }
  }
  getInfo() {
    this.spinner.show();
    this.service.getRFReaders().subscribe((Response) => {
      var logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == "8000") {
        this.data = Response["Response"][1];
        this.datatable();
        this.parkingarea = Response["Response"][2];
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
    })
  }
  datatable() {
    $('#mytable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#mytable').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  saveReader() {
    this.service.saveReaderInfo().subscribe((Response) => {
      var savelog = Response["Response"][0][0]["_logcode"];
      if (savelog == '8100') {
        this.toaster.success("Added successfully");
        $('#mytable').DataTable().destroy();
        this.getInfo();
      } else if (savelog == '8101') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
    this.resetform();
  }

  getBoombarrierList() {
    this.boombarrierlist = [];
    this.paservice.parkingspaceid = this.service.reader.parking_lot_id;
    this.paservice.boombarrierList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2050') {
        this.boombarrierlist = Response["Response"][1];
      }
    })
  }
  getIndex(i: any) {
    this.dataindex = Array(this.data[i]);
    this.service.reader.parking_lot_id = this.dataindex[0]['parking_lot_id'];
    this.getBoombarrierList()
  }


  changeStatus(data: Rfreaders) {
    if (data.isactive == '1') {
      data.isactive = '0';
      var status = '1'
    }
    else {
      data.isactive = '1';
      status = '2'
    }
    data.token = JSON.parse(localStorage.getItem('access_token'));
    this.service.changeRfReaderStatus(data).subscribe((Response) => {
      var statuslog = Response["Response"][0][0]["_logcode"];
      if (statuslog == '8200' && status == '1') {
        this.toaster.info("Device Deactivated!");
      }
      if (statuslog == '8200' && status == '2') {
        this.toaster.success("Device Activated!");
      }
      if (statuslog == '8201') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  editReaderInfo(editdata: Rfreaders) {
    this.service.updateRFReader(editdata).subscribe((Response) => {
      var updatelog = Response["Response"][0][0]["_logcode"];
      if (updatelog == '8300') {
        this.toaster.success("Updated successfully");
        this.getInfo();
      } else if (updatelog == '8301') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  getparkingspaceid(id: any) {
    this.service.reader.parking_lot_id = id;
    this.getBoombarrierList();
  }
}
