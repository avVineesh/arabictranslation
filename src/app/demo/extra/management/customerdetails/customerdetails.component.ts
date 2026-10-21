import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AddCustomerDetails, GetCustomerdetails } from './customerdetails.modal';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { Observable } from 'rxjs';
import { CustomerdetailsService } from './customerdetails.service';
import { VehiclecategoryService } from '../../adminsettings/vehiclecategory/vehiclecategory.service';
@Component({
  selector: 'app-customerdetails',
  standalone: true,
  imports: [
    CommonModule,      
      NgbCarouselModule,
      FormsModule,
      HttpClientModule,
      NgxSpinnerModule,
      NgbDropdownModule,
      SharedModule,
      RouterModule
  ],
  providers:[DatePipe],
  templateUrl: './customerdetails.component.html',
  styleUrl: './customerdetails.component.scss'
})
export default class CustomerdetailsComponent {
  @ViewChild('userPhoto')
  myInputVariable: ElementRef;
  datas: GetCustomerdetails[];
  logcode1: any;
  indexedData: any;
  updatelogcode: any;
  logcode: any;
  rftagid :any;
  Csv: any = [];
  buttonflag: number;
  VehType: any;
  owndata: any;
  statusflag: string;
  ownuserindexdata: any[];
  custtype: any;
  parkingspace: any;
  datalist: any;
  myDate: any;
  excelheaders: any;
  fileReaded: any;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    //showTitle: true,
    useBom: true,
    noDownload: false,
    headers: ["Name", "EmployeeID", "TagID", "ContactNumber", "ExpiryDate"]
  };
  tagstatusflag: string;
  // Variables for angular fire base image upload........................
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  img: any;
  imgarray: any = [];
  percentage: Observable<number>;
  organizations: any;
  constructor(public service: CustomerdetailsService, public toaster: ToastrService, public router: Router,
    public spinner: NgxSpinnerService, public vehservice: VehiclecategoryService, public datepipe: DatePipe,public modalService: NgbModal) { }

  ngOnInit() {
    this.getOwnStaff();
    this.resetform();
    this.getVehicleCat();
    this.buttonflag = 1;
    this.excelheaders = [
      { "Name": '', "EmployeeID": '', "TagID": '', "ContactNumber": '', "ExpiryDate": '' }
    ];
  }
  addCustomer(add: ElementRef) {
    this.modalService.open(add, { size: 'md' });
  }
  bulkUpload(bulk: ElementRef) {
    this.modalService.open(bulk, { size: 'md' });
  }
  editModal(edit: ElementRef) {
    this.modalService.open(edit, { size: 'md' });
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.addCustomer = {
      fullname: "",
      phone: "",
      token: "",
      vehiclecat: "",
      vehiclenumber: "",
      isactive: "",
      custid: "",
      isspecial: 0,
      ctype: "",
      parkinglotid: "",
      empid: "",
      enddate: "",
      tagid: "",
      tagstatus: "",
      imageurl: "",
      type:"",
      orgid:""

    },
      this.service.bulkEmployee = {
        phone: [],
        fullname: [],
        vehiclecat: "",
        vehiclenumber: "",
        isactive: "",
        token: "",
        custid: "",
        isspecial: "",
        ctype: "",
        parkinglotid: "",
        empid: [],
        enddate: [],
        tagid: [],
        type: ""
      }
  }

  //function for getting the information of the customer
  onGet() {
    // $('#custtable').DataTable().destroy();
    // $('#ownusertable').DataTable().destroy();
    this.buttonflag = 0;
    this.spinner.show();
    this.service.GetCustomerDetails()
      .subscribe((Response: GetCustomerdetails[]) => {
        this.logcode = Response["Response"][0][0]["_logcode"];
        if (this.logcode == '1420') {
          this.datas = Response["Response"][1];
          this.spinner.hide();
          //this.datatable();
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
  onAdd() {
    if (!this.service.addCustomer.isspecial) {
      this.service.addCustomer.isspecial = 0;
    } else {
      this.service.addCustomer.isspecial = 1;
    }
    this.service.addCustomer.ctype=0;
    this.service.AddCustomerDetails()
      .subscribe((Response) => {
        status = Response["Response"][0][0]["_logcode"];
        if (status == '1430') {
          this.toaster.success("Saved to Database");
        } else if (status == '1432') {
          this.toaster.warning("Phone number already exist");

        } else if (status == '1431') {
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        } else if (status == '1433') {
          this.toaster.warning("Employee ID already Exist!");
        }
        else if (status == '1434') {
          this.toaster.warning('Tag Already assigned!');
        }
        this.getOwnStaff();
      });

    this.resetform();
  }
  // function for changing the status of the customer
  changeStatus(customerdata: GetCustomerdetails) {
    if (customerdata.isactive == '1') {
      customerdata.isactive = '0';
    }
    else {
      customerdata.isactive = '1';
    }
    customerdata.token = JSON.parse(localStorage.getItem('access_token'));

    this.service.ChangeCustomerStatus(customerdata).subscribe((response) => {
      this.logcode1 = response["Response"][0][0]["_logcode"];
      if (this.logcode1 == '1440') {
        this.toaster.success("Status Changed Successfully:)");
      }
      else {
        this.toaster.error("Some thing Went Wrong:(");
      }
    });
  }
  // function for getting the index of the customer 
  getValueIndex(i: any) {
    this.indexedData = Array(this.datas[i]);
    localStorage.setItem('custdetails', JSON.stringify(this.indexedData));
  }
  // function for updatinfg the details of the customer
  onUpdate(datas: GetCustomerdetails) {
    this.service.updateCustomer(datas).subscribe((Response) => {
      this.updatelogcode = Response["Response"][0][0]["_logcode"];
      if (this.updatelogcode == "1890") {
        //$('#custtable').DataTable().destroy();
        this.ngOnInit();
        this.toaster.success("Updated Successfully");
      } else if (this.updatelogcode == "1892") {
        this.toaster.warning("Customer Details already exist with same email! Please check email");
        //$('#custtable').DataTable().destroy();
        this.ngOnInit();
      } else if (this.updatelogcode == "1893") {
        this.toaster.warning("Customer Details already exist with same phonenumber! Please check phonenumber");
        //$('#custtable').DataTable().destroy();
        this.ngOnInit();
      }
      else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  datatable() {
    $('#custtable').DataTable().destroy();
    $('#ownusertable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#custtable').DataTable(
      );
      table.draw();
    });
  }
  getOwnStaff() {
    // $('#custtable').DataTable().destroy();
    // $('#ownusertable').DataTable().destroy();
    this.buttonflag = 1;
    this.spinner.show();
    this.service.getOwnUsers().subscribe((Response) => {
      this.custtype = Response["Response"][2];
      this.parkingspace = Response["Response"][4];
      this.rftagid = Response["Response"][5];
      let ownlog = Response["Response"][0][0]["_logcode"];
      if (ownlog == '2380') {
        if (Response["Response"][1].length != 0) {
          //$('#ownusertable').DataTable().destroy();
          this.owndata = Response["Response"][1];
        } else {
          this.toaster.info("No data available!")
        }
        this.spinner.hide();
        //this.owndatatable();
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
  changeTab(event: any) {  //event for changing tab action................................................................................................................................
    // $('#custtable').DataTable().destroy();
    // $('#ownusertable').DataTable().destroy();
    if (event.nextId == '0') {
      // Action for first tab
      this.buttonflag = 0;
      this.getAllVehicleList();
    }

    else if (event.nextId == '1') {
      // Action for second tab
      this.buttonflag = 1;
      this.getOwnStaff();
    }
  }
  getVehicleCat() {
    this.vehservice.GetVehicleCateory().subscribe((Response) => {
      this.VehType = Response["Response"][1];
      this.organizations = Response["Response"][2];
    });
  }
  owndatatable() { //function for ownstaff datatable
    $('#custtable').DataTable().destroy();
    $('#ownusertable').DataTable().destroy();
    $(document).ready(function () {
      var table = $('#ownusertable').DataTable();
      table.draw();
    });
  }
  changeOwnUserStatus(data: AddCustomerDetails) {  //function for changing the own user status
    if (data.isactive == '1') {
      data.isactive = '0';
      this.statusflag = '1';
    }
    else {
      data.isactive = '1';
      this.statusflag = '0';
    }
    data.token = JSON.parse(localStorage.getItem('access_token'));
    this.service.changeownUserStatus(data).subscribe((Response) => {
      let statuslog = Response["Response"][0][0]["_logcode"];
      if (statuslog == '2390' && this.statusflag == '1') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.success("User deactivated!");
        this.getOwnStaff();
      } else if (statuslog == '2390' && this.statusflag == '0') {
       // $('#ownusertable').DataTable().destroy();
        this.toaster.success("User activated!");
        this.getOwnStaff();
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
  getOwnUserIndex(i: any) {
    this.ownuserindexdata = Array(this.owndata[i]);
    localStorage.setItem('custdetails', JSON.stringify(this.ownuserindexdata));
  }
  updateOwnUserData(updatedata: any) {
    if (!updatedata.isspecial) {
      updatedata.isspecial = 0;
    } else {
      updatedata.isspecial = 1;
    }
    if (this.service.addCustomer.imageurl != "") {
      updatedata.imageurl = this.service.addCustomer.imageurl
    }
    this.service.updateOwnUsers(updatedata).subscribe((Response) => {
      let updatelog = Response["Response"][0][0]["_logcode"];
      if (updatelog == '2400') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.success("Updated successfully");
        this.getOwnStaff();
      } else if (updatelog == '2402') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.warning("Phonenumber already exist!");
        this.getOwnStaff();
      } else if (updatelog == '2403') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.warning("Employee ID already Exist!");
        this.getOwnStaff();
      } else if (updatelog == '2404') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.warning("Tag Already Assigned!");
        this.getOwnStaff();
      }
      else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  getAllVehicleList() {
    // $('#custtable').DataTable().destroy();
    // $('#ownusertable').DataTable().destroy();
    this.buttonflag = 0;
    this.spinner.show();
    this.service.getAllVehicleList()
      .subscribe((Response) => {
        this.logcode = Response["Response"][0][0]["_logcode"];
        if (this.logcode == '2680') {
          this.datalist = Response["Response"][1];
          this.datatable();
          this.spinner.hide();
          //this.datatable();
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
  dateFormat() {                 // function for disabling past date from the datepicker
    this.myDate = new Date();
    this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  //Function for downloading csv file 
  downloadCSV() {
    let date: any = new Date();
    date = this.datepipe.transform(date, 'medium')
    new AngularCsv(this.excelheaders, "Employee_Details " + date, this.csvOptions);
  }
  employeeBulkUpload(fileInput: any) {
    this.fileReaded = fileInput.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    reader.onload = (e) => {
      let csv: any = reader.result;
      let allTextLines = csv.split(/\r\n|\n/);
      let headers = allTextLines[0].split(',');
      let lines = [];
      let fullname = [];
      let empid = [];
      let tagid = [];
      let phone = [];
      let enddate = [];
      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }
          lines.push(tarr);
        }
        // log each row to see output 

      }
      this.Csv = lines;
      for (let i = 1; i < this.Csv.length; i++) {
        fullname.push(this.Csv[i][0]);
        empid.push(this.Csv[i][1]);
        tagid.push(this.Csv[i][2]);
        phone.push(this.Csv[i][3]);
        enddate.push(this.Csv[i][4]);
      }
      for (let i = 0; i < empid.length; i++) {
        this.service.bulkEmployee.fullname = fullname[i];
        this.service.bulkEmployee.empid = empid[i];
        this.service.bulkEmployee.tagid = tagid[i];
        this.service.bulkEmployee.phone = phone[i];
        this.service.bulkEmployee.enddate = enddate[i];
        this.service.addBulEmployeeDetails(this.service.bulkEmployee).subscribe((Response) => {
          let bulklog = Response["Response"][0][0]["_logcode"];
          if (bulklog == '1430') {
            this.toaster.success("Employee Details Uploaded Successfully");
            this.ngOnInit();
          }
          else if (bulklog == '1432') {
            this.toaster.warning("Contact Number Already Assigned!");
          }
          else if (bulklog == '1433') {
            this.toaster.success("Employee ID Already Exist!")
            this.ngOnInit();
          } else if (bulklog == '1434') {
            this.toaster.warning("Tag Already Assigned!");
            this.ngOnInit();
          }
          else if (bulklog == '1431') {
            this.toaster.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
        });
      }
    }
  }
  changeTagStatus(data: AddCustomerDetails) {  //function for changing the own user status
    if (data.tagstatus == '1') {
      data.tagstatus = '0';
      this.tagstatusflag = '1';
    }
    else {
      data.tagstatus = '1';
      this.tagstatusflag = '0';
    }
    data.token = JSON.parse(localStorage.getItem('access_token'));
    this.service.changeTagStatus(data).subscribe((Response) => {
      let statuslog = Response["Response"][0][0]["_logcode"];
      if (statuslog == '2880' && this.tagstatusflag == '1') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.success("Tag deactivated!");
        this.getOwnStaff();
      } else if (statuslog == '2880' && this.tagstatusflag == '0') {
        //$('#ownusertable').DataTable().destroy();
        this.toaster.success("Tag activated!");
        this.getOwnStaff();
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

  // onFileSelected(event) {  // function for uploading file ..............................
  //   this.imgarray = [];
  //   this.percentage= null;
  //   var n = Date.now();
  //   if (event.target.files[0].size <= 1000000) {
  //     const file = event.target.files[0];
  //     const filePath = `StaffImageSuntec/${n}`;
  //     const fileRef = this.storage.ref(filePath);
  //     const task = this.storage.upload(`StaffImageSuntec/${n}`, file);
  //     this.percentage = task.percentageChanges(); 
  //     task
  //       .snapshotChanges()
  //       .pipe(
  //         finalize(() => {
  //           this.downloadURL = fileRef.getDownloadURL();
  //           this.downloadURL.subscribe(url => {
  //             if (url) {
  //               this.fb = url;
  //             }
  //             this.imgarray.push(this.fb);
  //             this.service.addCustomer.imageurl = this.imgarray;
  //             this.toaster.success("Image Uploaded");
  //           });
  //         })
  //       )
  //       .subscribe(url => {
  //         if (url) {
  //           console.log(url);
  //         }
  //       });
  //   } else {
  //     this.toaster.info("Image Size Exceeds 1MB!");
  //     this.myInputVariable.nativeElement.value = "";
  //   }

  // }
}
