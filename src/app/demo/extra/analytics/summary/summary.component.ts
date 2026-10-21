import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SummaryService } from './summary.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-summary',
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
  providers:[DatePipe],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export default class SummaryComponent implements OnInit {
  @ViewChild('parkingSpaceSelect') parkingSpaceSelect!: ElementRef;
    @ViewChild('summarytype') summaryTypeSelect!: ElementRef;
     @ViewChild('summaryby') summaryby!: ElementRef;
  logcode: any;
  data: any;
  summary: any=0;
  invoiceid: any;
  sum:any;
  sumbydate:any
  showinfo:any=0;
  showmaininfo:any=0;
  showinvoice: number=0;
  showdate: number=0;
  myDate: any;
  minDate: any;
  dateinfo: any;
  summarybydate: any;
  parkingspace: any;
  summarytypeoption: string | null = null;
  parkinglotname: any;
  cashtotal: any;
  cardtotal: any;
  upitotal: any;
  daterange: any;
  fastagtotal:any;
  time: any;
  qrtotal: any;
  showexport: any;
  cashcount: number;
  cardcount: number;
  upicount: number;
  qrcount: number;
  fastagcount: number;
  summaryData: { label: string; count: number; amount: any; icon:any; class:any;}[];
  totalcount: number;
  vehsummary: any;
  specification: any='Group';
  specificationsummary: any[];
  pdfProgress = 0;
isPdfGenerating = false;
pdfStatus = '';
  bookingtotal: number;
  bookingcount: number;
 constructor(public service:SummaryService,public datepipe: DatePipe,public toaster:ToastrService,public router:Router,public spinner:NgxSpinnerService,public modalService: NgbModal){

 }
 ngOnInit() {
  this.showexport=0
  this.getParkingspaceList();
  this.myDate = new Date();
  //this.resetform();
}
 downloadModal(download: ElementRef) {
    this.modalService.open(download, { size: 'md', centered: true, });
  }
resetform(form?: NgForm) {
  if (form!= null)
    form.resetForm();
    this.service.frominvoice="",
    this.service.toinvoice="",
    this.service.parkingspaceid=""
    this.service.summarytypeoption=""
    this.parkingSpaceSelect.nativeElement.selectedIndex = 0;
    this.summaryTypeSelect.nativeElement.selectedIndex = 0;
    this.summaryby.nativeElement.selectedIndex = 0;

  }
 getSummary(){  // function for gettingg invoice summary details.......................................................................................
   // 1) Validate Parking Space
   this.spinner.show();
   this.cashtotal=0
   this.cardtotal=0;
   this.upitotal=0;
   this.qrtotal=0;
   this.fastagtotal=0;
   this.bookingtotal =0;
    this.cashcount=0;
   this.cardcount=0;
   this.upicount=0;
   this.qrcount=0;
   this.fastagcount=0;
  this.bookingcount = 0;
   this.totalcount=0;
   this.summaryData=[];
   this.summary=[];
   this.vehsummary=[];
  if (!this.service.parkingspaceid) {
    this.toaster.warning('Please select a Parking Space.');
    return;
  }

  // 2) Validate Summary Type
  if (!this.service.summarytypeoption) {
    this.toaster.warning('Please select a Summary Type.');
    return;
  }

  // 3) (Optional) Validate Invoice From/To if those are required
  if (!this.service.frominvoice || !this.service.toinvoice) {
    this.toaster.warning('Please enter both “Invoice From” and “Invoice To.”');
    return;
  }
  this.showmaininfo= 1; 
  this.showinfo=1;
  this.sum=0;
  this.service.getSummary().subscribe((Response)=>{
      this.showexport=1;
    let logcode = Response["Response"][0][0]["_logcode"];
    this.summary = Response["Response"][1];
    this.vehsummary = Response["Response"][4];
    this.invoiceid = Response["Response"][2];
    if(Response["Response"][3].length!=0){
      this.parkinglotname = Response["Response"][3][0]["parking_lot_name"];
    }else{
      this.toaster.warning("Please Select A Parking Space");
      this.parkinglotname="";
    }
    
    for(let i=0;i<this.summary.length;i++){
      this.sum = this.sum+ this.summary[i]["amt"];
      if(this.summary[i]["paytype"]=='cash'){
        this.cashtotal=this.cashtotal+this.summary[i]["amt"];
        this.cashcount=this.cashcount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='upi'){
        this.upitotal=this.upitotal+this.summary[i]["amt"];
         this.upicount=this.upicount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='card'){
        this.cardtotal=this.cardtotal+this.summary[i]["amt"];
         this.upicount=this.upicount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='QR'){
        this.qrtotal=this.qrtotal+this.summary[i]["amt"];
         this.qrcount=this.qrcount+this.summary[i]["vehtypecount"];
      }
       if(this.summary[i]["paytype"]=='fastag'){
        this.fastagtotal=this.fastagtotal+this.summary[i]["amt"];
         this.fastagcount=this.fastagcount+this.summary[i]["vehtypecount"];
      }
       if(this.summary[i]["paytype"]=='Razorpay'){
        this.bookingtotal=this.bookingtotal+this.summary[i]["amt"];
         this.bookingcount=this.bookingcount+this.summary[i]["vehtypecount"];
      }
    }
    this.totalcount=this.fastagcount+this.qrcount+this.cardcount+this.upicount+this.cashcount;
   this.summaryData = [
  { label: 'Cash', count: this.cashcount, amount: this.cashtotal, icon: 'fas fa-money-bill-wave', class: 'cash' },
  { label: 'UPI', count: this.upicount, amount: this.upitotal, icon: 'fas fa-mobile-alt', class: 'upi' },
  { label: 'QR', count: this.qrcount, amount: this.qrtotal, icon: 'fas fa-qrcode', class: 'qr' },
  { label: 'Card', count: this.cardcount, amount: this.cardtotal, icon: 'fas fa-credit-card', class: 'card' },
  { label: 'FasTag', count: this.fastagcount, amount: this.fastagtotal, icon: 'fas fa-car', class: 'fastag' },
  { label: 'Booking', count: this.bookingcount, amount: this.bookingtotal, icon: 'fas fa-car', class: 'fastag' }
];
    //this.resetform();
     if(logcode=='2691'){
      this.toaster.error("Token Expired");
      localStorage.removeItem("access_token");
      localStorage.removeItem("orgid");
      localStorage.removeItem("Role");
      localStorage.removeItem("privilege");
      this.router.navigate(['login']); 
      this.spinner.hide();
    }
    this.spinner.hide();
  });
}
getSummaryType(event:any){ //Event for getting summary type method ...........................................
  this.showmaininfo= 1; 
  if(event.target.value=='date'){
    this.showinvoice = 0;
    this.showdate = 1;
    this.showinfo=0;
  }
  if(event.target.value=='invoice'){
    this.showinvoice = 1;
    this.showdate = 0;
    this.showinfo = 0;
  }
}
getDateForSummary(event: any){ // event for getting date for summary
 
  this.service.date = event.target.value;
}
dateFormat() {                 // function for disabling past date from the datepicker
  this.myDate = new Date();
 
  this.myDate = this.datepipe.transform(this.myDate,'yyyy-MM-dd');
  this.minDate = new Date(this.myDate);
  
}
getSummaryByDate(){  // function for getting summary by date ..............................................................
 
    this.cashtotal=0
   this.cardtotal=0;
   this.upitotal=0;
   this.qrtotal=0;
   this.fastagtotal=0;
   this.bookingtotal=0;
   this.cashcount=0;
   this.cardcount=0;
   this.upicount=0;
   this.qrcount=0;
   this.fastagcount=0;
  this.bookingcount = 0
   this.totalcount=0
   this.summaryData=[];
   this.summary=[];
   this.vehsummary=[];
   this.specificationsummary = []
  if (!this.service.parkingspaceid) {
    this.toaster.warning('Please select a Parking Space.');
    return;
  }

  // 2) Validate Summary Type
  if (!this.service.summarytypeoption) {
    this.toaster.warning('Please select a Summary Type.');
    return;
  }

  // 3) (Optional) Validate Invoice From/To if those are required
  if (!this.service.from || !this.service.to) {
    this.toaster.warning('Please enter both “From” and “To.” Date' );
    return;
  }
   this.spinner.show();
  this.showmaininfo= 1; 
  this.showinfo=1;
  this.sum=0;
  this.service.getSummarybyDate().subscribe((Response)=>{
    this.showexport = 1
    let logcode = Response["Response"][0][0]["_logcode"];
    this.summary = Response["Response"][1];
    this.vehsummary = Response["Response"][4];
    this.specificationsummary= Response["Response"][5];
    this.daterange = Response["Response"][2];
    if(Response["Response"][3].length!=0){
      this.parkinglotname = Response["Response"][3][0]["parking_lot_name"];
    }else{
      this.toaster.warning("Please Select A Parking Space");
      this.parkinglotname="";
    }
    
    for(let i=0;i<this.summary.length;i++){
      this.sum = this.sum+ this.summary[i]["amt"];
      if(this.summary[i]["paytype"]=='cash'){
        this.cashtotal=this.cashtotal+this.summary[i]["amt"];
        this.cashcount=this.cashcount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='upi'){
        this.upitotal=this.upitotal+this.summary[i]["amt"];
         this.upicount=this.upicount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='card'){
        this.cardtotal=this.cardtotal+this.summary[i]["amt"];
         this.cardcount=this.cardcount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='QR'){
        this.qrtotal=this.qrtotal+this.summary[i]["amt"];
         this.qrcount=this.qrcount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='fastag'){
        this.fastagtotal=this.fastagtotal+this.summary[i]["amt"];
         this.fastagcount=this.fastagcount+this.summary[i]["vehtypecount"];
      }
      if(this.summary[i]["paytype"]=='Razorpay'){
        this.bookingtotal=this.bookingtotal+this.summary[i]["amt"];
         this.bookingcount=this.bookingcount+this.summary[i]["vehtypecount"];
      }
    }
    this.totalcount=this.fastagcount+this.qrcount+this.cardcount+this.upicount+this.cashcount;
   this.summaryData = [
  { label: 'Cash', count: this.cashcount, amount: this.cashtotal, icon: 'fas fa-money-bill-wave', class: 'cash' },
  { label: 'UPI', count: this.upicount, amount: this.upitotal, icon: 'fas fa-mobile-alt', class: 'upi' },
  { label: 'QR', count: this.qrcount, amount: this.qrtotal, icon: 'fas fa-qrcode', class: 'qr' },
  { label: 'Card', count: this.cardcount, amount: this.cardtotal, icon: 'fas fa-credit-card', class: 'card' },
  { label: 'FasTag', count: this.fastagcount, amount: this.fastagtotal, icon: 'fas fa-car', class: 'fastag' },
  { label: 'Booking', count: this.bookingcount, amount: this.bookingtotal, icon: 'fas fa-car', class: 'booking' }
];
    //this.resetform();
     if(logcode=='2691'){
      this.toaster.error("Token Expired");
      localStorage.removeItem("access_token");
      localStorage.removeItem("orgid");
      localStorage.removeItem("Role");
      localStorage.removeItem("privilege");
      this.router.navigate(['login']); 
    }
    this.spinner.hide();
  });
}
getParkingspaceList(){
  this.service.getParkingpaces().subscribe((Response)=>{
    let logcode=Response["Response"][0][0]["_logcode"];
    if(logcode=='1150'){
      this.parkingspace=Response["Response"][1];
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
getPArkingspaceid(event:any){
  
this.service.parkingspaceid=event.target.value;

}

 getSummarytypeoption(event: any) {
    this.summarytypeoption = event.target.value;
    this.service.summarytypeoption = event.target.value;
    // 2) Immediately clear out any previous results:
  this.summary = [];
  this.sum = 0;
  // (If you also track invoiceid or parkinglotname per‐fetch, you can reset them too:)
  this.invoiceid = null;
  this.parkinglotname = '';
  // 3) Hide the “info” message if necessary:
  this.showinfo = 0;
  }

 getviewspecification(event: any) {
    this.specification = event.target.value;
    this.service.specification = event.target.value;
   
  }
downloadPDF() {

  this.isPdfGenerating = true;
  this.pdfProgress = 0;
  this.pdfStatus = 'Preparing report...';

  this.logCurrentTime();

  this.myDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd_HH-mm-ss');

  const DATA: any = document.getElementById('print-section');

  if (!DATA) {
    this.isPdfGenerating = false;
    return;
  }

  DATA.classList.add('remove-shadow');

  this.pdfProgress = 10;

  setTimeout(() => {

    this.pdfStatus = 'Rendering page...';
    this.pdfProgress = 30;

    html2canvas(DATA, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY
    })
    .then((canvas) => {

      this.pdfStatus = 'Processing image...';
      this.pdfProgress = 60;

      const imgData = canvas.toDataURL('image/png');

      this.pdfStatus = 'Creating PDF...';
      this.pdfProgress = 80;

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );

      heightLeft -= pageHeight;

      let pageCount = 1;

      // Additional pages
      while (heightLeft > 0) {

        pageCount++;

        this.pdfStatus = `Creating page ${pageCount}...`;

        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );

        heightLeft -= pageHeight;
      }

      this.pdfStatus = 'Saving PDF...';
      this.pdfProgress = 95;

      setTimeout(() => {

        pdf.save(`summary-report-${this.myDate}.pdf`);

        this.pdfProgress = 100;
        this.pdfStatus = 'Completed';

        DATA.classList.remove('remove-shadow');

        setTimeout(() => {
          this.isPdfGenerating = false;
          this.pdfProgress = 0;
          this.pdfStatus = '';
        }, 1000);

      }, 300);

    })
    .catch((err) => {

      console.error('PDF Generation Error:', err);

      DATA.classList.remove('remove-shadow');

      this.pdfStatus = 'Failed';

      setTimeout(() => {
        this.isPdfGenerating = false;
        this.pdfProgress = 0;
      }, 1000);

    });

  }, 100);
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


exportToExcel() {
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  /* ================= SUMMARY ================= */
  const summaryHeader = [
    ['Cochin Smart Mission Limited'],
    [this.parkinglotname],
    ['Revenue Summary Report'],
    [`Generated Time: ${this.time}`],
    this.invoiceid?.length
      ? [`Invoice From ${this.invoiceid[0]?.from_invoice} to ${this.invoiceid[0]?.to_invoice}`]
      : [],
    this.daterange?.length
      ? [`Date From ${this.daterange[0]?.from_date} to ${this.daterange[0]?.to_date}`]
      : [],
    ['Total Collection (RS)', this.sum || 0],
    ['Total Billed Vehicles', this.totalcount || 0],
  ];

  const headerSheet = XLSX.utils.aoa_to_sheet(summaryHeader);
  XLSX.utils.book_append_sheet(workbook, headerSheet, 'Summary');

  /* ================= MAIN BREAKDOWN ================= */
  let tableData: any[] = [];
  let tabledata2: any[] = [];
   let tabledata3: any[] = [];

  if (this.summarytypeoption === 'Vehicle') {
    tableData = this.summary.map(item => ({
      'Parking Space': item.parking_lot_name,
      'Vehicle Type': item.vehtype,
      'Payment Mode': item.paytype,
      'Count': item.vehtypecount,
      'Amount (₹)': item.amt
    }));

    tabledata2 = this.vehsummary.map(item => ({
      'Parking Space': item.parking_lot_name,
      'Vehicle Type': item.vehtype,
      'Count': item.vehtypecount,
      'Amount (₹)': item.amt
    }));
     tabledata3 = this.specificationsummary.map(item => ({
      'Parking Space': item.Location,
      'Bike(count)': item.TwoWheeler,
      'Car(count)': item.FourWheeler,
      'Auto(count)': item.Auto,
       'Tempotraveller(count)': item.Tempotraveller,
        'Minibus/Van(count)': item.MiniBus_Van,
         'Tempo(count)': item.Tempo,
          'Bus(count)': item.Bus,
          'Lorry(count)': item.Lorry,
      'Total Amount (₹)': item.Totalcollection
    }));
  }

  if (this.summarytypeoption === 'Staff') {

    tableData = this.summary.map(item => ({
      'Parking Space': item.parking_lot_name,
      'Staff Name': item.fullname,
      'Payment Mode': item.paytype,
      'Count': item.vehtypecount,
      'Amount (₹)': item.amt
    }));
     tabledata2 = this.specificationsummary.map(item => ({
      'Parking Space': item.parking_lot_name,
      'Staff Name': item.fullname,
      'Cash': item.Cash,
      'UPI': item.UPI,
      'Card': item.Card,
      'QR': item.QR,
      'Total Amount (₹)': item.TotalCollection
    }));
  }

  const dataSheet = XLSX.utils.json_to_sheet(tableData);
  XLSX.utils.book_append_sheet(workbook, dataSheet, 'Payment type Breakdown');

  /* ================= VEHICLE BREAKDOWN (NEW SHEET) ================= */
  if (tabledata2.length > 0) {
    const vehicleSheet = XLSX.utils.json_to_sheet(tabledata2);
    XLSX.utils.book_append_sheet(workbook, vehicleSheet, 'Vehicle Breakdown1 ');
  }
if (tabledata3.length > 0) {
    const vehicleSheet = XLSX.utils.json_to_sheet(tabledata3);
    XLSX.utils.book_append_sheet(workbook, vehicleSheet, 'Vehicle Breakdown2');
  }
  /* ================= PAYMENT TOTALS ================= */
  if (this.showinfo === 1) {
    const paymentTotals = [
      {
        'Cash (₹)': this.cashtotal,
        'UPI (₹)': this.upitotal,
        'QR (₹)': this.qrtotal,
        'Card (₹)': this.cardtotal,
        'FasTag (₹)': this.fastagtotal,
        'Booking (₹)': this.bookingtotal
      },
      {
        'Cash (count)': this.cashcount,
        'UPI (count)': this.upicount,
        'QR (count)': this.qrcount,
        'Card (count)': this.cardcount,
        'FasTag (count)': this.fastagcount,
        'Booking (count)': this.bookingcount,
      }
    ];

    const paymentSheet = XLSX.utils.json_to_sheet(paymentTotals);
    XLSX.utils.book_append_sheet(workbook, paymentSheet, 'Payment Totals');
  }

  /* ================= EXPORT ================= */
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const file = new Blob([excelBuffer], {
    type: 'application/octet-stream'
  });

  saveAs(file, `Revenue_Summary_WINPARK_${this.time}.xlsx`);
}

}
