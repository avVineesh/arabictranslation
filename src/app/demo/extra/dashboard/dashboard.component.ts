import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import * as Highcharts from 'highcharts';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ParkingareaService } from '../parkingsettings/parkingarea/parkingarea.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { PlaceholderCard1Component } from 'src/app/theme/shared/components/placeholder-card/placeholder-1.component';
import { timer } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// bootstrap import
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, HighchartsChartModule, NgxSpinnerModule, PlaceholderCard1Component],
  providers:[DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Fixed typo
})
export class DashboardComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  orgArray: any[] = [];
  orglist: any;
  nameArray: any[] = [];
  orgname: any;
  isendpoint: any;
  resLength: any;
  areaname: any;
  usedcount: any;
  bikecount: any;
  filteroption:any;
  mainobj: any[];
  time: any;
  dailycount: any;
  sales: { title: string; icon: string; amount: any; percentage: string; progress: number; design: string; progress_bg: string; pre:string; }[];
  projectedsales: { title: string; icon: string; amount: any; percentage: string; progress: number; design: string; progress_bg: string; pre:string; }[];
  weeklycount: any;
  monthlycount: any;
  predaycount: any;
  preweekcount: any;
  premonth: any;
  dayarrow: any;
  showoption:any=0;
  weekarrow: string;
  montharrow: string;
  daypercentage: any;
  weekpercentage: any;
  monthpercentage: any;
  parkingspaceamount: any;
  percentagedata: any;
  isorg: number = 1;
  callfunction = 0;
  orgid: any;
  lotname: any;
  totalamount: any;
  parkedveh: any;
  agencytotal: any;
  showdata: number;
  blacklistedvehicles: any;
  intervalId: NodeJS.Timeout;
  secondinterval: NodeJS.Timeout;
 present:any=1;
  cashTotal: number = 0;  // Replace with actual data from API
  upiTotal: number = 0;
  cardTotal: number = 0;
  bookingTotal: number = 0;
  estimatedamount: any;
  selectedTab: 'actual' | 'projected' = 'actual';
  excpectedlot: any;
  expectedcount: any;
  expectedagency: any;
  expectedday: any;
  preexpectedday: any;
  expectedweek: any;
  preexpectedweek: any;
  expectedmonth: any;
  preexpectedmonth: any;
  expectedamnt: any;
  occupancydata: any;
  fastagtotal: number;
  id: any;
  date:Date;
  parkingspacelist: any;
  qrtotal: any;
  timerSub:any;
  fromdate:any;
  todate:any;
   myDate: any;
  constructor(public service: DashboardService, public router: Router, public toastr: ToastrService,
     public paservice: ParkingareaService, public spinner: NgxSpinnerService, public cdr: ChangeDetectorRef,public datepipe: DatePipe) { }

  ngOnInit() {
    this.curDate();
    this.nameArray = [];
    this.service.orgid = JSON.parse(localStorage.getItem('orgid'));
    this.service.id = JSON.parse(localStorage.getItem('orgid'));
    //this.orgid=JSON.parse(localStorage.getItem('orgid')) ;
    this.service.isorg = 1;
    this.orgname = localStorage.getItem('orgname');
    this.getParkingspaceList();
    this.getOrgList();
    this.callfunction = 0;
    this.showoption=0;
    // this.secondinterval = setInterval(() => {
    //   this.getParkingSpace();
    // }, 300000); // Runs every 3 minute
     this.id = setInterval(() => {
      this.curDate();
    }, 5000);
    this.fromdate = '';
    this.todate='';
    this.service.date='';
    this.service.todate='';
  }

  isInViewport = true; // Constant value for now

  trackSale(index: number, sale: any): number {
    return sale ? sale.id : index; // Use `id` if available or fallback to `index`
  }

  pieDonutChartOptions: Highcharts.Options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    colors: ['#6FE71D', '#E71D1D', '#F2E103', '#2517CA', '#f44236', '#f4c22b'],
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Percentage',
        // colorByPoint: true,
        size: '90%',
        innerSize: '50%',
        data: [

        ]
      }
    ]
  };
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
      this.getParkingSpace();
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
    this.getParkingSpace();
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
    //this.getParkingSpace()
    this.getOrgList();
    ;
  }
  getParkingSpace() {   //Function for getting parking space names for count chart  bar
    // this.spinner.show();
    //  this.timerSub = timer(8000).subscribe(() => {
    //   this.spinner.hide();
    // });
    this.service.getParkingSpace().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '20000') {
        this.areaname = Response["Response"][1];
       
       
         
        this.getMostCollectedParkingspace();
        this.getParkedVehicles();
        this.getAgencyTotal();
        this.getOccupancy();
         this.getUsedCount();
         this.getAllCollection();
        
      } else {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  getUsedCount() { //Function for getting used count of parking slots for both car and bike .......................................................................
    this.spinner.show();
    var cartime = []
    var biketime = [];
    this.dayarrow = 'icon-arrow-up text-c-green';
    this.weekarrow = 'icon-arrow-up text-c-green';
    this.montharrow = 'icon-arrow-up text-c-green';
    this.service.getUsedCount().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2870') {
        this.usedcount = Response["Response"][1];
        this.expectedamnt = Response["Response"][15];
        for (let i = 0; i < this.usedcount.length; i++) {

        }
        this.bikecount = Response["Response"][2];
        this.dailycount = Response["Response"][3][0]["dailycount"];
        this.weeklycount = Response["Response"][4][0]["weeklycount"];
        this.monthlycount = Response["Response"][5][0]["monthlycount"];
        this.predaycount = Response["Response"][6][0]["predailycount"];
        this.preweekcount = Response["Response"][7][0]["preweek"];
        this.premonth = Response["Response"][8][0]["premonth"];
        this.expectedday = Response["Response"][9][0]["dailycount"];
        this.preexpectedday= Response["Response"][10][0]["predailycount"];
        this.expectedweek = Response["Response"][11][0]["weeklycount"];
        this.preexpectedweek = Response["Response"][12][0]["preweek"];
        this.expectedmonth = Response["Response"][13][0]["monthlycount"];
        this.preexpectedmonth = Response["Response"][14][0]["premonth"];
        // function for calculating day percentage difference .........................................................................................
        let daydiff = this.dailycount - this.predaycount;
        if (this.dailycount > this.predaycount) {
          this.daypercentage = Math.round((Math.abs(daydiff) / Math.abs(this.dailycount)) * 100);
        } if (this.dailycount < this.predaycount) {
          this.dayarrow = 'icon-arrow-down text-c-red';
          this.daypercentage = Math.round((Math.abs(daydiff) / Math.abs(this.predaycount)) * 100);
        }
        if (daydiff == 0) {
          this.daypercentage = 0
        } else if (this.predaycount == 0) {
          this.daypercentage = 100;
        }
        if (this.daypercentage == Infinity) {
          this.daypercentage = 0;
        }
        // .............................................................................................................................
        //  Calculating weeklypercentage..............................................................................................
        let weekdiff = this.weeklycount - this.preweekcount;
        if (this.weeklycount > this.preweekcount) {
          this.weekpercentage = Math.round((Math.abs(weekdiff) / Math.abs(this.weeklycount)) * 100);
        } if (this.weeklycount < this.preweekcount) {
          this.weekarrow = 'icon-arrow-down text-c-red';
          this.weekpercentage = Math.round((Math.abs(weekdiff) / Math.abs(this.preweekcount)) * 100);
        }

        if (weekdiff == 0) {
          this.weekpercentage = 0
        } else if (this.preweekcount == 0) {
          this.weekpercentage = 100;
        }
        if (this.weekpercentage == Infinity) {
          this.weekpercentage = 0;
        }
        //  ..................................................................
        let monthdiff = this.monthlycount - this.premonth;
        if (this.monthlycount > this.premonth) {
          this.monthpercentage = Math.round((Math.abs(monthdiff) / Math.abs(this.monthlycount)) * 100);
        } if (this.monthlycount < this.premonth) {
          this.montharrow = 'icon-arrow-down text-c-red';
          this.monthpercentage = Math.round((Math.abs(monthdiff) / Math.abs(this.premonth)) * 100);
        }

        if (monthdiff == 0) {
          this.monthpercentage = 0
        } else if (this.premonth == 0) {
          this.monthpercentage = 100;
        }
        if (this.monthpercentage == Infinity) {
          this.monthpercentage = 0;
        }
        this.countData();
        for (var k = 0; k < this.usedcount.length; k++) {
          if (!cartime.includes(this.usedcount[k]['hour'])) {
            cartime.push(this.usedcount[k]['hour'])
          }

        }
        for (let i = 0; i < this.bikecount.length; i++) {
          if (!biketime.includes(this.bikecount[i]['hour'])) {
            biketime.push(this.bikecount[i]['hour']);
          }
        }
        // for (var t = 0; t < cartime.length; t++) {
        //   if (cartime[t] == cartime[t - 1]) {
        //     cartime.splice(t, 1);
        //   }
        // }
        if(this.present==1){
          this.addMissingZero(this.usedcount, cartime, 'car');
        }
        

        this.addMissingZero(this.expectedamnt,cartime,'proj');
        //this.addMissingZero(this.bikecount,biketime,'bike');
        //this.bikeOccupancy(bikecount);
      }

    });
  }
  addMissingZero(usedcount, cartime, type) { //function for adding missing time for a null parking area(adding zero value to a parking area) for Car
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
    this.ObjectMappingForChart(result, cartime, type)
  }
  ObjectMappingForChart(usedcount, cartime, type) {  //Function for  creating object for  chart representationg of cars ocurance
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
    if (type == 'car' && this.present=='1') {
      this.vehiclewiseCollection(cartime, mainobj)

    }
    if (type == 'proj' && this.present=='0') {
      this.expectedamntchart(cartime, mainobj) //Calling chart function for car 

    }
    // else if(type =='bike'){
    //   this.twoWheelerCount(cartime, mainobj) // calling chart function for bike
    // }
  }
  vehiclewiseCollection(time: any, arr: any) {   //graph for 4 wheeler comparison in lower basement and upper basement
    Highcharts.chart('container1', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Vehicle Count'
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
          text: 'Count'
        }
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ''
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: arr
    });
    this.spinner.hide();
  }

  countData() {
    this.sales = [
      {

        title: 'Daily Count',
        icon: this.dayarrow,
        amount: this.dailycount,
        percentage: this.daypercentage + '%',
        progress: this.daypercentage,
        design: 'col-md-6',
        progress_bg: 'progress-c-theme',
        pre:'Last day-'+this.predaycount,
      },
      {
        title: 'Weekly Count',
        icon: this.weekarrow,
        amount: this.weeklycount,
        percentage: this.weekpercentage + '%',
        progress: this.weekpercentage,
        design: 'col-md-6',
        progress_bg: 'progress-c-theme2',
        pre:'Last week-'+this.preweekcount
      },
      {
        title: 'Monthly Count',
        icon: this.montharrow,
        amount: this.monthlycount,
        percentage: this.monthpercentage + '%',
        progress: this.monthpercentage,
        design: 'col-md-12',
        progress_bg: 'progress-c-theme3',
        pre: 'Last month-'+this.premonth
      }
    ];
    this.projectedsales=[
      {

        title: 'Projected amount Today',
        icon: this.dayarrow,
        amount: this.expectedday *40,
        percentage: this.daypercentage + '%',
        progress: this.daypercentage,
        design: 'col-md-6',
        progress_bg: 'progress-c-theme',
        pre:'Last day-'+this.preexpectedday *40,
      },
      {
        title: 'Projected Amount this Week',
        icon: this.weekarrow,
        amount: this.expectedweek*40,
        percentage: this.weekpercentage + '%',
        progress: this.weekpercentage,
        design: 'col-md-6',
        progress_bg: 'progress-c-theme2',
        pre:'Last week-'+this.preexpectedweek*40
      },
      {
        title: 'Projected Amount this Month',
        icon: this.montharrow,
        amount: this.expectedmonth*40,
        percentage: this.monthpercentage + '%',
        progress: this.monthpercentage,
        design: 'col-md-12',
        progress_bg: 'progress-c-theme3',
        pre: 'Last month-'+this.preexpectedmonth*40
      }
    ]
  }
  getAllCollection() {
   
    this.cashTotal=0;
    this.fastagtotal=0;
    this.qrtotal=0;
    this.cardTotal=0;
    this.upiTotal=0;
    this.bookingTotal=0;
    this.estimatedamount=0;
    var amounttime = [];
    var collectontype = []
    this.service.getAllCollection().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2470') {
        this.parkingspaceamount = Response["Response"][1];
        this.percentagedata = Response["Response"][2];
        this.estimatedamount = Response["Response"][3][0]["estimated"];
        for (var k = 0; k < this.parkingspaceamount.length; k++) {
          if (!amounttime.includes(this.parkingspaceamount[k]['xaxis'])) {
            amounttime.push(this.parkingspaceamount[k]['xaxis'])
          }

        }
        for (var i = 0; i < this.percentagedata.length; i++) {
          if (this.percentagedata[i]["name"] == 'Razorpay') {
            this.percentagedata[i]["name"] = 'Booking';
            this.bookingTotal=this.percentagedata[i]["total_amount"];
          }
          if (this.percentagedata[i]["name"] == 'upi') {
            this.upiTotal=this.percentagedata[i]["total_amount"];
          }
          if (this.percentagedata[i]["name"] == 'cash') {
            this.cashTotal=this.percentagedata[i]["total_amount"];
          }
          if (this.percentagedata[i]["name"] == 'card') {
            this.cardTotal=this.percentagedata[i]["total_amount"];
          }
          if (this.percentagedata[i]["name"] == 'fastag') {
            this.fastagtotal=this.percentagedata[i]["total_amount"];
          }
          if (this.percentagedata[i]["name"] == 'QR') {
            this.qrtotal=this.percentagedata[i]["total_amount"];
          }
        }
        const initialData: Highcharts.PointOptionsObject[] = this.percentagedata;
        if(this.present==1){
            this.updateChart('piecontainer', initialData);
        }
      
        this.addMissingZeroForAmount(this.parkingspaceamount, amounttime)
      }
    });
   
  }
  addMissingZeroForAmount(data, time) { // function for adding missing zeros for all amount graph data
    //   for (let j = 0; j < time.length; j++) {
    //     let occurance = 0;
    //     for (let i = 0; i < data.length; i++) {
    //       if (time[j] == data[i]["xaxis"]) {
    //         occurance++;
    //       }
    //     }
    //     if (occurance != this.areaname.length) {
    //       let obj = {};
    //       let index = 0;
    //       for (let i = 0; i < this.areaname.length; i++) {
    //         for (let k = 0; k < data.length; k++) {
    //           if (time[j] == data[k]["xaxis"]) {
    //             if (this.areaname[i]["parking_lot_name"] != data[k]["parking_lot_name"]) {
    //               index = k;
    //               obj = { "xaxis": time[j], "amount": 0, "parking_lot_name": this.areaname[i]["parking_lot_name"] }
    //             }
    //           }
    //         }
    //       }
    //       data.splice(index, 0, obj);
    //     }
    // }

    // Create a result array
    let result: any[] = [];
    // Iterate through each time slot
    for (let xaxis of time) {
      for (let area of this.areaname) {
        // Check if the combination exists in amount
        let found = data.find(item =>
          item.xaxis === xaxis && item.parking_lot_name === area.parking_lot_name
        );

        // If found, push the existing record, otherwise push a new record with count: 0
        result.push(
          found || { xaxis, amount: 0, parking_lot_name: area.parking_lot_name }
        );
      }
    }

    // Sort by hour
    const hourOrder = time; // Adjust if needed
    result.sort((a, b) => hourOrder.indexOf(a.xaxis) - hourOrder.indexOf(b.xaxis));

    this.ObjectMappingForAmountChart(result, time)
  }
  ObjectMappingForAmountChart(amountdata, time) {  //Function for  creating object for  chart representation of amount collected
    var mainobj = [];
    for (var i = 0; i < this.areaname.length; i++) {
      let obj = { name: '', data: [] }
      obj.name = this.areaname[i]['parking_lot_name'];
      for (var j = 0; j < amountdata.length; j++) {
        if (obj.name == amountdata[j]['parking_lot_name']) {
          obj.data.push(amountdata[j]['amount']);
        }
        if (j + 1 == amountdata.length) {
          mainobj.push(obj);
        }

      }
    }
    if(this.present=='1'){

      setTimeout(() => {
        this.amountChart(time, mainobj)
      }, 1000);
      
    }
   
    //this.renderChart('piecontainer', this.pieDonutChartOptions);
  }

  amountChart(time: any, arr: any) {   //graph for amountCollection
    Highcharts.chart('container2', {
      chart: {
        type: 'areaspline'

      },
      title: {
        text: 'Collection'
      },
      // legend: {
      //   layout: 'vertical',
      //   align: 'right',
      //   verticalAlign: 'top',
      //   x: 100,
      //   y: 50,
      //   floating: true,
      //   borderWidth: 1,
      //   backgroundColor:
      //     Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      // },
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
        title: {
          text: 'Amount'
        }
      },
      accessibility: {
        enabled: false
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
        area: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: arr
    });
  }
  renderChart(containerId: string, options: Highcharts.Options) {
    Highcharts.chart(containerId, options);
  }
  updateChart(containerId: string, dynamicData: Highcharts.PointOptionsObject[]) {
    const updatedOptions: Highcharts.Options = {
      ...this.pieDonutChartOptions,
      series: [
        {
          ...(this.pieDonutChartOptions.series?.[0] as Highcharts.SeriesPieOptions),
          data: dynamicData
        }
      ]
    };
    this.renderChart(containerId, updatedOptions);
  }
  getMostCollectedParkingspace() {
  
    this.service.getMostCollectedParkingspace().subscribe((Response) => {
      
      let logcode = Response["Response"][0][0]["_logcode"];
      let length = Response["Response"][1].length
      if (logcode == '20010') {
        if( Response["Response"][3].length!=0){
          this.excpectedlot= Response["Response"][3][0]['parking_lot_name'];
          this.expectedcount= Response["Response"][3][0]['totalentry'];
        }
        this.blacklistedvehicles = Response["Response"][2]
        
        if (length != 0) {
          this.lotname = Response["Response"][1][0]['parking_lot_name'];
          this.totalamount = Response["Response"][1][0]['total_collected'];
          
        }else{
          this.lotname="No Parking Space";
          this.totalamount="0";
        }

      } else {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
   
  }
  getParkedVehicles() {
  
    this.service.getParkedVehicles().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '20020') {
        this.parkedveh = Response["Response"][1];
      } else {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
   
  }
  getAgencyTotal() {
 
    this.service.getAgencyTotal().subscribe((Response) => {
      let logcode = Response["Response"][0][0]['_logcode'];
      if (logcode == '20030') {
        this.expectedagency= Response["Response"][2];
        let length = Response["Response"][1].length;
        
        if (length != 0) {
          this.showdata = 1
          this.agencytotal = Response["Response"][1];
          
        } else {
          this.showdata = 0;
        }
      }
    })
 
  }
  getIndex(id: any) {
    let indexdata = Array(this.blacklistedvehicles[id]);
    this.service.vehno = indexdata[0]["vehno"];
    this.service.updateBlacklistedVeh().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '3130') {
        this.toastr.success("Removed");
        this.getMostCollectedParkingspace();
      }
    })
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);

    }
    if(this.secondinterval){
      clearInterval(this.secondinterval);
    }
     if (this.id) {
      clearInterval(this.id);
    }
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  
  }
  changetoActual(){
    setTimeout(() => {
      // Your code to run after delay
     this.getParkingSpace();
    }, 2000); // time in milliseconds (2000ms = 2s)
    this.present=1;
    this.selectedTab = 'actual';
   
  }
  changetoProjected(){
    setTimeout(() => {
      // Your code to run after delay
     this.getParkingSpace();
    }, 2000); 
    this.present=0;
    this.selectedTab = 'projected';
  }


  expectedamntchart(time: any, arr: any) {   //graph for expected amount showing for review only..................
    Highcharts.chart('container3', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Projected Amount'
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
          text: 'Amount'
        }
      },
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false
      },
      tooltip: {
        valueSuffix: ''
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: arr
    });
    this.spinner.hide();
  }
  getOccupancy(){
  
    this.service.getParkingSpaceOccupancy().subscribe((Response)=>{
      let logcode=Response["Response"][0][0]["_logcode"];
      if(logcode='6000'){
        this.occupancydata=Response["Response"][1];
      }else{
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    })
  
  }
  getOccupancyColor(percentage: number): string {
    if (percentage < 50) return 'success';
    else if (percentage < 80) return 'warning';
    else return 'danger';
  }
  curDate() {
    this.date = new Date();
  }
  getParkingspaceList(){
    this.service.getParkingspacelist().subscribe((Response)=>{
      let logcode=Response["Response"][0][0]["_logcode"];
      if(logcode='1490'){
        this.parkingspacelist=Response["Response"][1];
      }else{
        this.toastr.error("Token Expired");
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

  dateFilter(){
    this.showoption=1;
    this.service.date=this.fromdate;
    this.service.todate=this.todate;
    this.getUsedCount();
    this.getAllCollection();
    this.getMostCollectedParkingspace();
    this.getAgencyTotal();
  }
  public getCurrentTimeStamp12hr(): string {
    const now = new Date();
    
    // 'h': 1-12 hour format (no leading zero)
    // 'hh': 01-12 hour format (with leading zero)
    // 'mm': minutes
    // 'ss': seconds
    // 'a': AM/PM
    const format = 'MM/dd/yyyy, hh:mm:ss a'; 

    // The transform method returns a string, or null if the input is invalid.
    const timeStamp = this.datepipe.transform(now, format);

    return timeStamp || 'Time Not Available';
  }
logCurrentTime() {
    this.time = this.getCurrentTimeStamp12hr();
  }
 downloadPDF() {
 
  this.logCurrentTime();

  this.myDate = this.datepipe.transform(new Date(), 'medium');

  const DATA: any = document.getElementById('print-section');
  DATA.classList.add('remove-shadow');
 this.spinner.show();
  html2canvas(DATA, {
    
    scale: 1,
    useCORS: true,
    logging: false
  }).then((canvas) => {

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save('Dashboard_CSML_' + this.myDate + '.pdf');

    DATA.classList.remove('remove-shadow');
    this.spinner.hide();
  }).catch(() => {
    DATA.classList.remove('remove-shadow');
    this.spinner.hide();
  });
}


}