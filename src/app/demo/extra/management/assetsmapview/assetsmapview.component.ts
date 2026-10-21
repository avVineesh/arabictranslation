import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {GoogleMap, MapMarker,MapAdvancedMarker, MapInfoWindow} from '@angular/google-maps';
import { AssetsmapviewService } from './assetsmapview.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-assetsmapview',
  standalone: true,
  imports: [BrowserModule, GoogleMap, MapAdvancedMarker, MapInfoWindow, CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SharedModule,
    RouterModule],
  templateUrl: './assetsmapview.component.html',
  styleUrl: './assetsmapview.component.scss'
})
export default class AssetsmapviewComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  center: google.maps.LatLngLiteral = {lat: 9.972862723044701, lng: 76.278619684421599};
  zoom = 12;
  display: google.maps.LatLngLiteral;
  markerDetails:any
  //  Control the visibility of details
  showDetails = false;
  // markerOptions: google.maps.marker.AdvancedMarkerElementOptions= {
  //   content:this.getMarkerContent('assets/images/logo/elvicto.png'),
  //   gmpClickable: true, // Enables click event
  // };
  markerPositions: any[] = [];
  // Custom map styles to hide specific markers
  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    fullscreenControl: true,
    mapTypeControl: false,
    mapId: '32a64d0d03d622be',
    
  };
  countdetails: any;
  assetscount: any;
  orglist: any;
  isorg: number = 1;
  callfunction = 0;
  nameArray: any;
  orgname: string;
  resLength: any;
  inactivelist: any;
  constructor(public service:AssetsmapviewService,public modalService: NgbModal,public toastr:ToastrService,public router: Router){}
  ngOnInit() {
    this.nameArray = [];
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
    // this.getMapData();
  }
  getOrgList() {
    this.service.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.service.isendpoint = 1;
        this.service.isorg = this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.service.isendpoint = 0;
        this.service.isorg = this.isorg;
      }
      if (logcode == '10000') {
        if (this.resLength != '2') {
          this.orglist = Response["Response"][1];
        }
      } else {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
      // if(this.callfunction==1){
      //   this.getUsedCount();

      // }
      this.getMapData();
    });

  }
  selectEvent(event: any) {
    this.callfunction = 1;
    this.service.orgid = event.target.value;
    this.service.id = event.target.value;
    for (var i = 0; i < this.orglist.length; i++) {
      if (this.orglist[i]["id"] == event.target.value) {
        this.nameArray.push(this.orglist[i]);
      }
    }
    this.getOrgList();
  }
  getId(data: any) {
    this.callfunction = 1;
    for (var j = 0; j < this.nameArray.length; j++) {
      if (data == this.nameArray[j]["id"]) {
        this.nameArray = this.nameArray.slice(0, j + 1);
      }
    }
    this.service.orgid = data;
    this.service.id = data;
    this.getOrgList();
    ;
  }
  getMapData(){
    this.service.getParkingSpacelist().subscribe((Response)=>{
      let logcode = Response["Response"][0][0]["_logcode"];
      if(logcode=="50"){
        this.markerPositions=Response["Response"][1];
        this.inactivelist= Response["Response"][2];
        this.markerPositions = this.markerPositions.map(position => {
          const isInactive = this.inactivelist.some(item => item.parkingspaceid === position.parking_lot_id);
          return {
            ...position,
            imageUrl: isInactive
              ? 'assets/images/logo/warning.png'
              : 'assets/images/logo/elvicto_csml_logo.png'
          };
        });
      }
    })
  }
  onMarkerClick(markerData: any, marker: MapAdvancedMarker) {
    //  Set marker details dynamically
    this.markerDetails = {
      title: markerData.parking_lot_name || "Unknown Parking",
      location: markerData.location || "Unknown Location",
      pricePerHour: markerData.pricePerHour || 0,
      openHours: markerData.openHours || "N/A"
    };
  
    //  Fetch parking slot details
    this.service.parking_lot_id = markerData.parking_lot_id;
    this.service.getParkingspaceDetails().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == "60") {
        this.countdetails = Response["Response"][1];
        this.assetscount = Response["Response"][2];
        this.infoWindow.open(marker); //  Open InfoWindow with new content
      } else {
        this.toastr.error("Token Expired");
        localStorage.clear();
        this.router.navigate(['login']);
      }
    });
  }
  getVehicleIcon(vehicletype: string): string {
    const icons: { [key: string]: string } = {
      'Car': '🚗',
      'Bike': '🏍️',
      'Bus': '🚌',
      'Truck': '🚛',
      'Van': '🚐',
      'Scooter': '🛵',
      'Auto': '🛺'
    };
    return icons[vehicletype] || '🚙'; // Default icon if not found
  }
  getMarkerContent(iconUrl: string): HTMLDivElement {
    let div = document.createElement('div');
    div.innerHTML = `<img src="${iconUrl}" width="50" height="50" style="display:block;">`; 
    return div;
  }
 
}
