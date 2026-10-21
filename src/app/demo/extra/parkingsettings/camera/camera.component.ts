import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CameraService } from './camera.service';
import { Camera } from './camera.modal';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CameraplotService } from '../cameraplot/cameraplot.service';
import { ParkingareaService } from '../parkingarea/parkingarea.service';
@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    // Ng2SearchPipeModule,
    NgxSpinnerModule,
    RouterModule,
    SharedModule
  ],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export default class CameraComponent implements OnInit {
  clusterdet: any;
  spacedetails: any;
  data: any;
  indexdatata: any[];
  showimg: number;
  
  imageurl: any;
  ledlight: any;
  display: any;
  showbblist: number;
  boombarrierlist: any;
  ocrview: number;
  constructor(public service:CameraService,public toaster: ToastrService, 
    public router: Router,public spinner: NgxSpinnerService,public modalService: NgbModal,public plotservice: CameraplotService,public paservice:ParkingareaService) { }

  ngOnInit() {
    this.resetform();
    this.getClusterDetails();
    this.getCameraDetails();
  }
  addCam(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  editCam(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.cameramodal = {
      token: "",
      parkingspaceid: "",
      id: "",
      status: "",
      clusterid: "",
      mac: "",
      ip: "",
      plot: "",
      ledid: "",
      tvid: "",
      type: "",
      bbid:"",
      ocr:0,
      direction:""
    }
  }
  getClusterDetails(){ //function for getting cluster details
    this.service.getClusterDet().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode == '2800'){
        this.clusterdet = Response["Response"][1];
      }
    });
  }

  saveCamera(){// function for saving camera details
    this.spacedetails = JSON.parse(localStorage.getItem('LotsDetails'));
    this.service.cameramodal.parkingspaceid =  this.spacedetails[0]["parking_lot_id"];
  this.service.saveCameraDet().subscribe((Response)=>{
    console.log(Response)
    let logcode = Response["Response"][0][0]["_logcode"];
    if(logcode == '2810'){
      $('#cameratable').DataTable().destroy();
      this.getCameraDetails();
      this.toaster.success("Saved Successfully!");
      this.resetform();
    }else if(logcode== '2812'){
      this.toaster.warning("Camera ID already exist");
    }else if(logcode == '2813'){
      this.toaster.warning("Cluster already Assigned");
    }
    else{
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
  getCameraDetails(){ //function for getting camera details
    this.spacedetails = JSON.parse(localStorage.getItem('LotsDetails'));
    this.service.lotid = this.spacedetails[0]["parking_lot_id"];
    this.spinner.show();
    this.service.getCameraDet().subscribe((Response)=>{
      let logcode= Response["Response"][0][0]["_logcode"];
      this.ledlight= Response["Response"][2];
      this.display = Response["Response"][3];
      if (logcode=='2820') {
        if (Response["Response"][1].length!=0) {
          this.data=Response["Response"][1];

          this.datatable();
          this.spinner.hide();
        } else {
          this.toaster.info("Camera not available!");
          this.datatable();
          this.spinner.hide();
        }
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
    this.getBoombarrierList();
  }

  datatable() {
    $('#cameratable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#cameratable').DataTable({
        "ordering": false
      });
      table.draw();
    });
  }
  changeStatus(data:Camera){ //function for changing the status of camera
    if (data.status == '1') {
      data.status = '0';
      var status = '1'
    }
    else {
      data.status = '1';
      status = '2'
    }
    data.token = JSON.parse(localStorage.getItem('access_token'));
    this.service.changeCamStatus(data).subscribe((Response) => {
      console.log(Response);
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2830' && status == '1') {
        this.toaster.success("Camera Deactivated!");
      }
      if (logcode == '2830' && status == '2') {
        this.toaster.success("Camera Activated!");
      }
      if (logcode == '2831') {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }

  getIndex(i:any){
    this.indexdatata = Array(this.data[i]);
    if(this.indexdatata[0]["type"]=='anpr'){
      this.showbblist = 1;
      this.ocrview=0;
    }else{
      this.showbblist=0;
      this.ocrview=1;
    }
    this.service.camid = this.indexdatata[0]["id"];
    this.plotservice.camid = this.indexdatata[0]["id"];
    localStorage.setItem('camid', this.indexdatata[0]["id"]);
  }
  getCamImage(){
    this.service.getCamImage().subscribe((Response) => {
      let entryimglog = Response["Response"][0][0]["_logcode"];
      if (entryimglog == '2840') {
        if (Response["Response"][1][0]["imgurl"] != null) {
          this.showimg = 1;
          this.imageurl = JSON.parse(Response["Response"][1][0]["imgurl"]);
        } else {
          this.showimg = 0;
        }

      }
    });
  }
  mouseClick(e:any){
    var bnds = e.target.getBoundingClientRect();
    var x= e.clientX - bnds.left;
    var y = e.clientY - bnds.top;
    console.log(x, y);
    
  }
  drawCoordinates(x,y){
    var pointSize = 50; // Change according to the size of the point.
    const canvas = <HTMLCanvasElement> document.getElementById('fx');
    const ctx = canvas.getContext('2d');


    ctx.fillStyle = "#ff2626"; // Red color

    ctx.beginPath(); //Start path
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
}
editCamera(editdata:Camera){
  this.service.updateCamera(editdata).subscribe((Response)=>{
    console.log(Response);
    let logcode = Response["Response"][0][0]['_logcode'];
    if(logcode =='3010'){
      this.toaster.success('Updated Successfully:)');
      this.getCameraDetails();
    }else{
      this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
    }
  })
}
getBbType(event:any){
  if(event.target.value=='anpr'){
    this.showbblist = 1;
    this.ocrview=0;
  }else{
    this.showbblist = 0;
    this.ocrview=1;
  }
}
getBoombarrierList(){
  this.paservice.parkingspaceid= this.service.lotid;
  this.paservice.boombarrierList().subscribe((Response)=>{
    let logcode = Response["Response"][0][0]["_logcode"];
    if(logcode == '2050'){
      this.boombarrierlist  = Response["Response"][1];
    }
  })
}
}
