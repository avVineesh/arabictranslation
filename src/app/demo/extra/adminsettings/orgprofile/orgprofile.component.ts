import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BankDetails, GetOrg, OrgSettings, OrgUpdate, Settings } from './orgprofile.modal';
import { ToastrService } from 'ngx-toastr';
import { OrgprofileService } from './orgprofile.service';
import { Router } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxSpinnerModule } from "ngx-spinner";
@Component({
  selector: 'app-orgprofile',
  standalone: true,
  imports: [
    CommonModule,      
      NgbCarouselModule,
      FormsModule,
      HttpClientModule,
      SharedModule,
      DataTablesModule,
      TimePickerModule,
      NgxSpinnerModule
  ],
  providers:[DatePipe],
  templateUrl: './orgprofile.component.html',
  styleUrl: './orgprofile.component.scss'
})

export default class OrgprofileComponent implements OnInit {
  public formatString: string = 'HH:mm';
  public interval: number = 30;


  data1: any;
  // Main task 
  // task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;
  // State for dropzone CSS toggling
  isHovering: boolean;
  OrgList: GetOrg[];
  orgdata: GetOrg[];
  public logcode = '';
  selectedFile: File = null;
  stafflist: any;
  orgSettings: OrgSettings;
  value: string;
  url: any;
  orgSetting: Settings;
  logcode1: any;
  orgtype: any;
  orgsettings: any;
  addorgtypedrp: any;
  eventvalue: any;
  organizations: any;
  checkvalue: any;
  savelogcode: any;
  userincharge: any;
  list: any[];
  name: string | number | string[];
  logcode2: any;
  dropdownorglist: any;
  viewflag: number;
  showvalue: number;
  canceldataview: number;
  percentview: number;
  amountview: number;
  bankdetails:BankDetails;
  constructor(public service: OrgprofileService, public toaster: ToastrService,
   public router: Router, 
    public datepipe: DatePipe,public modalService: NgbModal) { }



    toggleHover(event: boolean) {
      this.isHovering = event;
    }
  
    // signInAnonymously() {
    //   this.service.anonymousLogin()
    //     .then(() => console.log("sign in anonymously, cool it works!"));
    // }
  
    startUpload(event: FileList) {
      // // The File object
      // const file = event.item(0)
  
      // // Client-side validation example
      // if (file.type.split('/')[0] !== 'image') {
      //   console.error('unsupported file type :( ')
      //   return;
      // }
  
      // // The storage path
      // const path = `test/${new Date().getTime()}_${file.name}`;
      // let store = firebase.storage();
      // let storepath = store.ref(path);
      // // Totally optional metadata
      // const customMetadata = { app: 'My AngularFire-powered PWA!' };
  
      // // The main task
      // this.task = this.storage.upload(path, file, { customMetadata })
  
      // // const storRef: firebase.storage.Reference = firebase.storage().ref(path);
      // // Progress monitoring
      // this.percentage = this.task.percentageChanges();
      // this.snapshot = this.task.snapshotChanges()
  
      // // The file's download URL
      // this.snapshot.pipe(finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL())).subscribe();
  
  
    }
  
    // Determines if the upload task is active
    isActive(snapshot) {
      return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
    }
  
    ngOnInit() {
      this.onGet();
      // this.OnGetStaff();
      this.resetform();
      this.viewflag = 0;
      this.showvalue = 0;
    }
    addBankdetails(add: ElementRef) {
      this.modalService.open(add, { size: 'md' });
    }
    resetform(form?: NgForm) {
      if (form != null)
        form.resetForm();
      this.service.FormData = {
        "orgid": "",
        "token": "",
        "fullname": 0,
        "layout": 0,
        "parkingnumber": 0,
        "reservation": 0,
        "cancellation": 0,
        "penalty": 0,
        "tac": "",
        "about": "",
        "privacy": "",
        "availability": "",
        "start": "",
        "end": "",
        "groupby": "",
        "cancellationamount": "",
        "cancellationtime": "",
        "cancellationmethod": "",
        "cancellationpercent": "",
        "flagexit": 0,
        "settings":
        {
          "fullname": 0,
          "layout": 0,
          "parkingnumber": 0,
          "reservation": 0,
          "cancellation": 0,
          "penalty": 0,
          "tac": "",
          "about": "",
          "privacy": "",
          "availability": "",
          "start": "",
          "end": "",
          "groupby": "",
          "cancellationamount": "",
          "cancellationtime": "",
          "cancellationmethod": "",
          "cancellationpercent": "",
          "flagexit": 0
        }
  
  
      }
      this.orgSettings = {
        "orgid": "",
        "token": "",
        "fullname": 0,
        "layout": 0,
        "parkingnumber": 0,
        "reservation": 0,
        "cancellation": 0,
        "penalty": 0,
        "tac": "",
        "about": "",
        "privacy": "",
        "availability": "",
        "start": "",
        "end": "",
        "groupby": "",
        "cancellationamount": "",
        "cancellationtime": "",
        "cancellationmethod": "",
        "cancellationpercent": "",
        "flagexit": 0,
        "settings":
        {
          "fullname": 0,
          "layout": 0,
          "parkingnumber": 0,
          "reservation": 0,
          "cancellation": 0,
          "penalty": 0,
          "tac": "",
          "about": "",
          "privacy": "",
          "availability": "",
          "start": "",
          "end": "",
          "groupby": "",
          "cancellationamount": "",
          "cancellationtime": "",
          "cancellationmethod": "",
          "cancellationpercent": "",
          "flagexit": 0
        }
      }
      this.orgSetting = {
  
        "fullname": 0,
        "layout": 0,
        "parkingnumber": 0,
        "reservation": 0,
        "cancellation": 0,
        "penalty": 0,
        "tac": "",
        "about": "",
        "privacy": "",
        "availability": "",
        "start": "",
        "end": "",
        "groupby": "",
        "cancellationamount": "",
        "cancellationtime": "",
        "cancellationmethod": "",
        "cancellationpercent": "",
        "flagexit": 0
  
      }
      this.service.orgadd = {
        org_name: "",
        add1: "",
        add2: "",
        city: "",
        state: "",
        pin: "",
        org_type: "",
        contactnumber: "",
        contactemail: "",
        longitude: "",
        latitude: "",
        org_logo: "",
        token: "",
        orgid: "",
        type: "",
        staffid: "",
        parentid: "",
        hierarchytype: ""
      }
      this.bankdetails={
        orgid:"",
        token:"",
        accountid:"",
        accountname:"",
        accountnumber:"",
        ifsc:"",
        emailid:""
      }
    }
  
  
    openMyModal(event) {
      document.querySelector('#' + event).classList.add('md-show');
    }
  
    closeMyModal(event) {
      ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
    }
  
    urlvalue(url: any) {
      this.url = url;
    }
    GetPAValue(i: any) {
      this.orgdata = Array(this.OrgList[i]);
      this.orgsettings = Array(this.orgSetting[i]);
      this.service.orgsettingsid = this.OrgList[i]["orgid"];
      this.bankdetails.orgid= this.OrgList[i]["orgid"];
  
    }
    onGet() {
      $('#mytable').DataTable().destroy();
      // this.spinner.show();
      this.service.GetOrgprofile()
        .subscribe((Response: GetOrg[]) => {
          this.logcode1 = Response["Response"][0][0]["_logcode"];
  
          this.addorgtypedrp = Response["Response"][3];
          if (this.logcode1 == '1020') {
            this.OrgList = Response["Response"][2];
            // this.spinner.hide();
            this.dropdownorglist = Response["Response"][2];
            this.orgtype = Response["Response"][1];
            this.userincharge = Response["Response"][4];
            $(document).ready(function () {
              var table = $('#mytable').DataTable({
                "ordering": false
              });
              table.draw();
            });
          }
          else if (this.logcode1 == '1021') {
            this.toaster.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
            // this.spinner.hide();
          }
  
  
        });
  
    }
    onGetSettings() {
      this.service.GetOrganizationSettings()
        .subscribe((Response: OrgSettings[]) => {
          this.orgSettings = Response["Response"][1][0];
          this.orgSetting = Response["Response"][1][0];
          this.data1 = +this.orgSettings["fullname"];
          if(this.orgSetting["cancellationpercent"]!=""){
            this.percentview =1;
            this.amountview = 0;
          }
          if(this.orgSetting["cancellationamount"]!=0){
            this.amountview=1;
            this.percentview=0;
          }
  
  
        });
  
    }
  
    onUpdate(orgdata: OrgUpdate) {
  
      orgdata.token = JSON.parse(localStorage.getItem('access_token'));
      orgdata.type = "update";
      orgdata.org_logo = this.url;
      
      this.service.OnUpdateOrg(orgdata)
        .subscribe((response) => {
          this.logcode = response["Response"][0][0]["_logcode"];
          if (this.logcode == '1850') {
            this.toaster.success("Saved to Database");
            // $('#mytable').DataTable().destroy();
            this.ngOnInit();
          } else if (this.logcode == '1851') {
            this.toaster.error("Connection TimedOut");
          } else {
            this.toaster.warning("Something Went Wrong");
          }
        });
    }
    // choose file logo upload
    onFileSelected(event) {
      this.selectedFile = <File>event.target.files[0];
  
    }
    // OnGetStaff() {
    //   this.staffservice.GetData().subscribe((Response) => {
        
    //     this.stafflist = Response["Response"][1];
    //   });
    // }
    onSubmit(formData: OrgSettings) {
      
      formData["start"] = this.datepipe.transform(formData["start"], 'h:mm a');
      formData["end"] = this.datepipe.transform(formData["end"], 'h:mm a');
  
      if (!formData["fullname"]) {
        this.service.FormData.settings.fullname = 0;
        
      } else {
        this.service.FormData.settings.fullname = 1;
        
      }
      if (!formData["reservation"]) {
        this.service.FormData.settings.reservation = 0;
        
      } else {
        this.service.FormData.settings.reservation = 1;
        
      }
      if (!formData["flagexit"]) {
        this.service.FormData.settings.flagexit = 0;
        
      } else {
        this.service.FormData.settings.flagexit = 1;
        
      }
      if (!formData["layout"]) {
        this.service.FormData.settings.layout = 0;
       
      } else {
        this.service.FormData.settings.layout = 1;
       
      }
      if (!formData["parkingnumber"]) {
        this.service.FormData.settings.parkingnumber = 0;
        
      } else {
        this.service.FormData.settings.parkingnumber = 1;
       
      }
      if (!formData["tac"]) {
        this.service.FormData.settings.tac = "";
      } else {
        this.service.FormData.settings.tac = formData["tac"];
      }
      if (!formData["about"]) {
        this.service.FormData.settings.about = "";
      } else {
        this.service.FormData.settings.about = formData["about"];
      }
      if (!formData["privacy"]) {
        this.service.FormData.privacy = "";
      } else {
        this.service.FormData.settings.privacy = formData["privacy"];
      } if (!formData["cancellation"]) {
        this.service.FormData.cancellation = 0;
      } else {
        this.service.FormData.settings.cancellation = 1;
         this.service.FormData.settings.cancellationmethod = formData["cancellationmethod"];
        this.service.FormData.settings.cancellationtime = formData["cancellationtime"];
      } if (formData["cancellationmethod"] == "absolute") {
        this.service.FormData.settings.cancellationamount = formData["cancellationamount"];
        this.service.FormData.settings.cancellationpercent = "";
      }
      if (formData["cancellationmethod"] == "percentage") {
        this.service.FormData.settings.cancellationpercent = formData["cancellationpercent"];
        this.service.FormData.settings.cancellationamount = "";
      }
      if (!formData["penality"]) {
        this.service.FormData.penalty = 0;
      } else {
        this.service.FormData.settings.penalty = 1;
      }
      if (!formData["availability"]) {
        this.service.FormData.settings.availability = "";
      } else {
        this.service.FormData.settings.availability = formData["availability"];
      }
      if (formData["availability"] == "custom") {
        this.service.FormData.settings.start = formData["start"];
        this.service.FormData.settings.end = formData["end"];
      } else {
        this.service.FormData.settings.start = "";
        this.service.FormData.settings.end = "";
      } if (!formData["groupby"]) {
        this.service.FormData.settings.groupby = 0;
      } else {
        this.service.FormData.settings.groupby = 1;
      }
  
      let data = JSON.stringify(this.service.FormData);
      this.service.PostOrganizationSettings(formData)
        .subscribe((response) => {
          this.logcode = response["Response"][0][0]["_logcode"];
          if (this.logcode == '1030') {
            this.toaster.success("Saved to Database");
            // $('#mytable').DataTable().destroy();
            this.onGetSettings();
            this.ngOnInit();
          } else {
            this.toaster.error("Something Went Wrong");
          }
        });
    }
    // nameSelected() {     //for filtering with organization type
  
    //   var orgtype = "";
    //   let typedropvalues = this.addorgtypedrp;
  
    //   $.fn.dataTable.ext.search.push(
    //     function (settings, data, dataIndex) {
    //       this.name = $("#orgtypename").val();
    //       for (let i = 0; i < typedropvalues.length; i++) {
    //         if (typedropvalues[i]["hierarchyid"] == this.name) {
    //           orgtype = typedropvalues[i]["hierarchy_type"];
    //         }
    //       }
  
    //       var orgtypename = data[1] || "";
    //       if (orgtype == orgtypename || this.name == 0) {
    //         return true;
    //       }
    //     });
    //   // $('#mytable').DataTable().destroy();
    //   // this.datatable();
    // }
  
    getOrganization(event: any) {  //For getting the corresponding values for organization types and parentorganization
      this.organizations = [];
      this.list = [];
      this.eventvalue = event.target.value;
      this.service.hierarchyid = this.eventvalue;
      for (var j = 0; j < this.addorgtypedrp.length; j++) {
        if (this.addorgtypedrp[j]["hierarchyid"] == this.eventvalue) {
          this.checkvalue = this.addorgtypedrp[j]["parentid"]
        }
      }
      for (var i = 0; i < this.dropdownorglist.length; i++) {
  
        if (this.dropdownorglist[i]["hierarchyid"] == this.checkvalue) {
          this.organizations.push(this.dropdownorglist[i]);
        }
  
        if (this.dropdownorglist[i]["hierarchyid"] == this.eventvalue) {
          this.list.push(this.dropdownorglist[i]);
        }
      }
    }
    saveOrganization() {
      this.service.saveOrganization().subscribe((Response) => {
        this.savelogcode = Response["Response"][0][0]["_logcode"];
        if (this.savelogcode == "1010") {
          this.toaster.success("Saved Successfully");
          // $('#mytable').DataTable().destroy();
          this.ngOnInit();
        }
        else if (this.savelogcode == "1012") {
          this.toaster.warning("Organization already Exists");
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
  
    getOrgUndId(event: any) {
      this.service.orgidunder = event.target.value;
  
    }
    // datatable() {
    //   $(document).ready(function () {
    //     var table = $('#mytable').DataTable({
    //       "ordering": false,
    //       stateSave: true
    //     });
    //     table.draw();
    //   });
    // }
    organizationunder() {
      this.service.GetOrganizationUnderId().subscribe((Response) => {
        this.logcode2 = Response["Response"][0][0]["_logcode"];
        if (this.logcode2 == "1860") {
          if (Response["Response"][1].length != 0) {
            this.OrgList = Response["Response"][1];
          } else {
            this.toaster.warning("No Organization Available");
            this.OrgList = [];
          }
          // $('#mytable').DataTable().destroy();
          // this.datatable();
  
        }
      });
    }
    triggervaluetrue() {
      this.viewflag = 1;
    }
    triggerValuefalse() {
      this.viewflag = 0;
    }
    gettime(event: any) {
    
    }
    showDropdown() {
      this.showvalue = 1;
    }
    viewCancellationData(event: any) {
      if (event.target.checked == true) {
        this.canceldataview = 1;
      }
      if (event.target.checked == false) {
        this.canceldataview = 0;
      }
    }
    viewPercentage() {
      this.percentview = 1;
      this.amountview = 0;
    }
    viewAmount() {
      this.amountview = 1;
      this.percentview = 0;
    }
    saveBankInfo(formdata:BankDetails){
      if(formdata.accountid==null){
        formdata.accountid=0;
      }
      this.service.saveBankDetails(formdata).subscribe((Response)=>{
        let logcode = Response["Response"][0][0]["_logcode"];
        if(logcode =='10000'){
          this.toaster.success("Bank Details updated Successfully");
          this.resetform();
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
    getBankDetails(){
      this.service.getBankDetails().subscribe((Response:BankDetails[])=>{
        let logcode= Response["Response"][0][0]["_logcode"];
        if(logcode=='20000'){ 
          if(Response["Response"][1].length!=0){
            this.bankdetails= Response["Response"][1][0];
          }
        }
        if(logcode=='20001'){
          this.toaster.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      })
    }
}
