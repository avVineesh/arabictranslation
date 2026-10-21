import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 
import { VehicleparkedService } from '../vehicleparkedreport/vehicleparkedreport.service';
import { CustomalalyticsService } from './customanalytics.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-customanalytics',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    NgxSpinnerModule,
    SharedModule
  ],
  providers:[DatePipe],
  templateUrl: './customanalytics.component.html',
  styleUrl: './customanalytics.component.scss'
})
export default class CustomanalyticsComponent implements OnInit {
   @ViewChild('select') selected!: ElementRef;
   @ViewChild('select1') selected1!: ElementRef;
   @ViewChild('select2') selected2!: ElementRef;
  datas: any;
  showdate: boolean = false;
  from: any;
  to: any;
  category: any = [];
  data: any;
  chartheading: any;
  charttype: any;
  sum: any = 0;
  fastagsum: any = 0;
  manualsum: any = 0;
  valetsum: any = 0;
  bookingsum: any =0;
  resLength: string;
  orglist: any;
  isorg: number = 1;
  callfunction = 0;
  nameArray: any;
  orgname: string;
  usedcount: any;
  areaname: any;
  default:any=0;
  filteroption:any;
  parkingspacelist: any;
  constructor(public vehparkedservice: VehicleparkedService, public toaster: ToastrService, public router: Router,
    public datepipe: DatePipe, public service: CustomalalyticsService) {

  }

  ngOnInit() {
    this.showdate=false
    this.default=0;
    this.nameArray = [];
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    this.getParkingspaceList();
    //this.service.customanalytics.spaceid=JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getOrgList();
    this.resetform();
   
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.customanalytics = {
      from: "",
      to: "",
      token: "",
      spaceid: "",
      analytics: "",
      range: "",
      isorg:""
    }
    this.selected.nativeElement.selectedIndex = 0;
    this.selected1.nativeElement.selectedIndex = 0;
    this.selected2.nativeElement.selectedIndex = 0;
  }
  getOrgList() {
    this.service.getOrgList().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      this.resLength = Response["Response"].length
      if (this.resLength != '2') {
        this.isorg = 1;
        this.service.isendpoint = 1;
        this.service.isorg = this.isorg;
        this.service.customanalytics.isorg=this.isorg;
      }
      if (this.resLength == '2') {
        this.isorg = 0;
        this.service.isendpoint = 0;
        this.service.isorg = this.isorg;
        this.service.customanalytics.isorg=this.isorg;
      }
      if (logcode == '10000') {
        if (this.resLength != '2') {
          this.orglist = Response["Response"][1];
        }
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
      // if(this.callfunction==1){
      //   this.getUsedCount();

      // }
      this.getParkingSpace();
      //this.defaultAnalytics();

    });

  }
  selectEvent(event: any) {
    this.callfunction = 1;
    this.service.orgid = event.target.value;
    this.service.id = event.target.value;
    this.service.customanalytics.spaceid=event.target.value;
    for (var i = 0; i < this.orglist.length; i++) {
      if (this.orglist[i]["id"] == event.target.value) {
        this.nameArray.push(this.orglist[i]);
      }
    }
    this.getOrgList();
    this.getParkingSpace();
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
    this.service.customanalytics.spaceid=data;
    this.getOrgList();
    this.getParkingSpace();
    ;
  }
  onGetParkingList() {
    this.vehparkedservice.GetParkingAreaList()
      .subscribe((Response) => {
        this.datas = Response["Response"][1];
        // this.service.customanalytics.spaceid = this.datas[0]["parking_lot_id"];
        this.defaultAnalytics();
        let logcode = Response["Response"][0][0]["_logcode"];
        if (logcode == '1491') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
  }
  setType(event: any) {
    this.service.customanalytics.analytics = event.target.value;
    if (event.target.value == 'vehiclecount') {
      this.chartheading = 'Vehicle Count'
    } else if (event.target.value == 'revenue') {
      this.chartheading = 'Collection'
    } else if (event.target.value == 'Staff') {
      this.chartheading = 'Staff Wise Collection'
    }
  }
  setRange(event: any) {
    if (event.target.value == 'lastmonth') {
      this.service.customanalytics.range = 'lastmonth'
      this.showdate = false;
      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      this.service.customanalytics.from = this.datepipe.transform(firstDay, 'yyyy-MM-dd');
      this.service.customanalytics.to = this.datepipe.transform(lastDay, 'yyyy-MM-dd');

    }
    else if (event.target.value == 'lastweek') {
      this.service.customanalytics.range = 'lastweek';
      this.showdate = false;
      let ourDate = new Date();
      //Change it so that it is 7 days in the past.
      let pastDate = ourDate.getDate() - 7;
      ourDate.setDate(pastDate);
      //Log the date to our web console.

      let yesterday = new Date();
      let previousDate = yesterday.getDate() - 1;
      yesterday.setDate(previousDate);

      this.service.customanalytics.from = this.datepipe.transform(ourDate, 'yyyy-MM-dd');
      this.service.customanalytics.to = this.datepipe.transform(yesterday, 'yyyy-MM-dd');

    }
    else if (event.target.value == 'custom') {
      this.service.customanalytics.range = 'custom';
      this.showdate = true;
      this.from = new Date();
      this.to = new Date();
    } else if (event.target.value == 'today') {
      this.service.customanalytics.range = 'today';
      this.showdate = false;
      this.service.customanalytics.from = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      this.service.customanalytics.to = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    } else {
      this.showdate = false;
    }
  }
  defaultAnalytics() { // function for getting the default analytics on page open revenue chart
    // var start = new Date();
    // start.setUTCHours(0, 0, 0, 0);
    this.service.customanalytics.from = new Date();
    // var end = new Date();
    // end.setUTCHours(23, 59, 59, 999);
    this.service.customanalytics.to = new Date();
    this.service.customanalytics.analytics = 'vehiclecount';
    this.chartheading = 'Current Day Vehicle Count';
    this.service.customanalytics.range = 'today';
    this.charttype = 'areaspline';
    this.service.getCustomAnalytics().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2910') {
        this.data = Response["Response"][1];
        if(this.service.customanalytics.analytics=='Occupancy'){
          this.data = Response["Response"][1];
          this.percentageData();
          
        }else{
          for (let i = 0; i < this.data.length; i++) {
            this.sum = this.sum + this.data[i]['amt'];
            if (this.data[i]['paytype'] == 'Manual') {
              this.manualsum = this.manualsum + this.data[i]['amt'];
            }
            if (this.data[i]['paytype'] == 'Fastag') {
              this.fastagsum = this.fastagsum + this.data[i]['amt'];
            }
            if (this.data[i]['paytype'] == 'Valet') {
              this.valetsum = this.valetsum + this.data[i]['amt'];
            }
            if (this.data[i]['paytype'] == 'Booking') {
              this.bookingsum = this.bookingsum + this.data[i]['amt'];
            }
          }
          this.customizeData(this.data);
        }
        
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  getCustomAnalytics() { // function for getting data for custom inputs =>filter 
    this.default=1;
    if (this.service.customanalytics.range == 'custom') {
      this.service.customanalytics.from = this.from;
      this.service.customanalytics.to = this.to;
    }
    this.service.getCustomAnalytics().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2910') {
        this.data = Response["Response"][1];
        if (this.service.customanalytics.analytics != 'Staff' && this.service.customanalytics.analytics !='Occupancy') {
          this.customizeData(this.data);
        } else  if(this.service.customanalytics.analytics=='Staff'){
          this.staffData(this.data)
        }else{
          this.percentageData()
        }

      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });

  }
  staffData(data: any) { // processing data of staff collection
    var xaxis = [];
    var amount = [];
    var arr = [];
    this.sum = 0;
    for (let i = 0; i < data.length; i++) {
      xaxis.push(data[i]['xAxis']);
      amount.push(data[i]['amt']);
      this.sum = this.sum + data[i]['amt'];
    }
    let lg = {
      data: amount,
      color: '#ee4540'
    }
    arr.push(lg);

    this.staffChart(xaxis, arr, this.charttype);
  }
  customizeData(data: any) { // function for getting the data for X axix for graph
    this.category = [];
    var time = [];
    var dataResult = [];
    var final = [];
    this.category.push('Manual');
    this.category.push('Fastag');
    // this.category.push('Valet');
    this.category.push('Booking');
    for (let i = 0; i < data.length; i++) {
      if (!time.includes(data[i]['xAxis'])) {
        time.push(data[i]['xAxis']);
      }
    }
    for (let i = 0; i < time.length; i++) {
      let tempCat = [];
      for (let j = 0; j < data.length; j++) {
        if (time[i] == data[j]['xAxis']) {
          tempCat.push(data[j]);
        }
      }
      let result = this.category.reduce((acc, str) => {
        const found = tempCat.find(item => item['paytype'] === str);
        if (found) {
          acc.push(found)
        } else {
          acc.push({ "num": 0, "xAxis": time[i], "amt": 0, "paytype": str })
        }
        return acc;
      }, []);
      dataResult.push(result)
    }
    final = Array.prototype.concat(...dataResult)
    this.ObjectMappingForChart(final, time);
  }
  ObjectMappingForChart(chartdata, time) {  //Function for  creating object for  chart
    var mainobj = [];
    this.sum = 0;
    this.fastagsum = 0;
    this.manualsum = 0;
    this.valetsum = 0;
    this.bookingsum = 0;
    let type = this.service.customanalytics.analytics
    if (type == 'vehiclecount') {
      for (let i = 0; i < chartdata.length; i++) {
        this.sum = this.sum + chartdata[i]['num'];
        if (chartdata[i]['paytype'] == 'Manual') {
          this.manualsum = this.manualsum + chartdata[i]['num'];
        }
        if (chartdata[i]['paytype'] == 'Fastag') {
          this.fastagsum = this.fastagsum + chartdata[i]['num'];
        }
        // if (chartdata[i]['paytype'] == 'Valet') {
        //   this.valetsum = this.valetsum + chartdata[i]['num'];
        // }
        if (chartdata[i]['paytype'] == 'Booking') {
          this.bookingsum = this.bookingsum + chartdata[i]['num'];
        }
      }
      for (var i = 0; i < this.category.length; i++) {
        let obj = { name: '', data: [] }
        obj.name = this.category[i];
        for (var j = 0; j < chartdata.length; j++) {
          if (obj.name == chartdata[j]['paytype']) {
            obj.data.push(chartdata[j]['num']);
          }
          if (j + 1 == chartdata.length) {
            mainobj.push(obj);
          }

        }
      }
    }
    if (type == 'revenue') {
      for (let i = 0; i < chartdata.length; i++) {
        this.sum = this.sum + chartdata[i]['amt'];
        if (chartdata[i]['paytype'] == 'Manual') {
          this.manualsum = this.manualsum + chartdata[i]['amt'];
        }
        if (chartdata[i]['paytype'] == 'Fastag') {
          this.fastagsum = this.fastagsum + chartdata[i]['amt'];
        }
        // if (chartdata[i]['paytype'] == 'Valet') {
        //   this.valetsum = this.valetsum + chartdata[i]['amt'];
        // }
        if (chartdata[i]['paytype'] == 'Booking') {
          this.bookingsum = this.bookingsum + chartdata[i]['amt'];
        }
      }
      for (var i = 0; i < this.category.length; i++) {
        let obj = { name: '', data: [] }
        obj.name = this.category[i];
        for (var j = 0; j < chartdata.length; j++) {
          if (obj.name == chartdata[j]['paytype']) {
            obj.data.push(chartdata[j]['amt']);
          }
          if (j + 1 == chartdata.length) {
            mainobj.push(obj);
          }

        }
      }
    }
    this.plotChart(time, mainobj, this.charttype) //Calling chart function for plotting
  }
  plotChart(time: any, arr: any, charttype: any) {   //Graph data
    Highcharts.chart('container', {
      chart: {
        type: charttype

      },
      title: {
        text: this.chartheading + '-' + this.sum
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',

        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      },
      xAxis: {
        categories: time,
        crosshair: true
        // plotBands: [{ // visualize the weekend
        //     from: 4.5,
        //     to: 6.5,
        //     color: 'rgba(68, 170, 213, .2)'
        // }]
      },
      yAxis: {
        // title: {
        //   text: 'Count'
        // }
      },
      accessibility:{
        enabled:false
      },
      tooltip: {
        shared: true,
        valueSuffix: ' ',
        borderColor: '#801336'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
          // fillColor:'#ff8080'
        },
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: arr
    });
  }
  staffChart(x: any, arr: any, charttype: any) { //function for plotting chart for staff
    Highcharts.chart('container', {
      chart: {
        type: charttype

      },
      title: {
        text: this.chartheading + '-' + this.sum
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      },
      xAxis: {
        categories: x,
        crosshair: true
        // plotBands: [{ // visualize the weekend
        //     from: 4.5,
        //     to: 6.5,
        //     color: 'rgba(68, 170, 213, .2)'
        // }]
      },
      yAxis: {
        // title: {
        //   text: 'Count'
        // }
      },
      tooltip: {

        shared: true,
        valueSuffix: ' ',
        borderColor: '#801336'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
          // fillColor:'#ff8080'
        },
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: arr
    });
  }
  typeSelect(event: any) {  //function for getting chart type 
    if (event.target.value == 'column') {
      this.charttype = 'column'
    }
    if (event.target.value == 'areaspline') {
      this.charttype = 'areaspline'
    }
  }
  selectSpace(event:any){ //event for getting parkingspace 
    this.service.customanalytics.spaceid = event.target.value;
  }

  //this function under these line s are for percentage calculation it may change ....................................................
  missingZero(usedcount, cartime, type){
    let result: any[] = [];
    // Iterate through each time slot
    for (let hour of cartime) {
      for (let area of this.areaname) {
        // Check if the combination exists in usedcount
        let found = usedcount.find(item =>
          item.hour === hour && item.parking_lot_name === area.parking_lot_name
        );

        // If found, push the existing record, otherwise push a new record with count: 0
        result.push(
          found || { hour, count: 0, parking_lot_name: area.parking_lot_name }
        );
      }
    }
    // Sort by hour
    const hourOrder = cartime; // Adjust if needed
    result.sort((a, b) => hourOrder.indexOf(a.hour) - hourOrder.indexOf(b.hour));
  this.mappingForChart(result, cartime, type)
  }
  getParkingSpace() {   //Function for getting parking space names for count chart  bar
    this.service.getParkingSpace().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '20000') {
        this.areaname = Response["Response"][1];
        if(this.default==0){
          this.defaultAnalytics();
        }if(this.default==1){
          this.getCustomAnalytics();
        }

        
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  mappingForChart(usedcount, cartime, type){
    var mainobj = [];
    for (var i = 0; i < this.areaname.length; i++) {
      let obj = { name: '', data: [] }
      obj.name = this.areaname[i]['parking_lot_name'];
      for (var j = 0; j < usedcount.length; j++) {
        if (obj.name == usedcount[j]['parking_lot_name']) {
          obj.data.push(usedcount[j]['count']);
        }
        if (j + 1 == usedcount.length) {
          mainobj.push(obj);
        }

      }
    }
    if (type == 'car') {
      this.vehiclewiseCollection(cartime, mainobj,this.charttype) //Calling chart function for car 

    }
  }
  vehiclewiseCollection(time: any, arr: any,charttype:any) {   //graph for 4 wheeler comparison in lower basement and upper basement
      Highcharts.chart('container1', {
        chart: {
          type: charttype
        },
        title: {
          text: 'Parking Space Occupancy in Percentage'
        },
        // subtitle: {
        //     text:
        //         'Source: <a target="_blank" ' +
        //         'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
        // },
        xAxis: {
          categories: time,
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Percentage'
          }
        },
        credits: {
          enabled: false
        },
        accessibility: {
          enabled: false
        },
        tooltip: {
          valueSuffix: '%'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: arr
      });
    }
  percentageData(){
  var time=[];
  for (var k = 0; k < this.data.length; k++) {
            if (!time.includes(this.data[k]['hour'])) {
              time.push(this.data[k]['hour'])
            }
  
          }
          this.missingZero(this.data, time, 'car');
        }
 getParkingspaceList(){
    this.service.getParkingspacelist().subscribe((Response)=>{
      let logcode=Response["Response"][0][0]["_logcode"];
      if(logcode='1490'){
        this.parkingspacelist=Response["Response"][1];
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
  parkispaceFilter(event:any){
      this.service.id=event.target.value;
      this.service.isorg=0;
      this.service.isendpoint=1;
      this.getParkingSpace();
  }
}
