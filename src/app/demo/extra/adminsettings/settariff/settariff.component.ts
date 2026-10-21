import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettariffService } from './settariff.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ViewtariffService } from '../viewtariff/viewtariff.service';
// import { JsonEditorComponent, JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
@Component({
  selector: 'app-settariff',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    // NgJsonEditorModule
    SharedModule,
    RouterModule
  ],
  providers:[DatePipe],
  templateUrl: './settariff.component.html',
  styleUrl: './settariff.component.scss'
})
export default class SettariffComponent implements OnInit {

  // @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  // public editorOptions: JsonEditorOptions;
  public data: any;
  public root: any;
  count: string = '';
  dynamicForm: FormGroup;
  formdata: any;
  dropdownvalue: any;
  default: any;
  value: [];
  definitions: any;
  typedefdata: any;
  list: any;
  name: any;
  unitDefData: any;
  unitdeflist: any;
  unitValues: any;
  unitlist: any;
  tariffdata: any;
  indexeddata: any;
  tariffid: any;
  parkingspace: any;
  logcode: any;
  pattern: any;
  tariffName: any;
  parkSpace: string[] = [];
  parkSpace1: string[] = [];
  parkassign: any;
  logcode1: any;
  logcode2: any;
  endpointlogcode: any;
  endpoint: any;
  parklogcode: any;
  viewvalue: any;
  myDate: any;
  dropvalue: number;
  lotavaillogcode: any;
  lotdetails: any;
  lotcount: any;
  viewcount: any;
  
 constructor(public service: SettariffService,
  // public parkingspaceservice: ParkinglotsService,
  public toastr: ToastrService,
  public router: Router,
  public datepipe: DatePipe,
  public viewtariffservice: ViewtariffService,
  public spinner: NgxSpinnerService,
  public modalService: NgbModal){}
  ngOnInit() {
    this.onGetTariffDefenitions();
    this.onGettariff();
    // this.getParkingSpace();
    this.viewvalue = 0;
    this.dropvalue = 0;
    this.viewcount = 0;
    this.resetform();
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.schemedefinition = {
      parkingspaceid: "",
      tariffname: "",
      tariff: "",
      token: ""
    }
  }
  assignTariff(assigntariff: ElementRef) {
    this.modalService.open(assigntariff, { size: 'md' });
  }
  addTariff(addtariff: ElementRef) {
    this.modalService.open(addtariff, { size: 'md' });
    setTimeout(() => {
       this.getdropdownvalue();
    }, 1000);
   
  }
  onGetTariffDefenitions() {
    this.service.getTariffDefenition().subscribe((Response) => {
      this.definitions = Response['Response'][1];
      //console.log(this.definitions);
      this.definitions.forEach(element => {
        if (element["typeid"] == "root") {
        this.root = typeof element['value'] === 'string' 
  ? JSON.parse(element['value']) 
  : element['value'];
          this.data = this.root["template"];
          this.formdata = this.root['properties'];
          //console.log(this.formdata);
          this.formdata.forEach(element => {
            if (element["type"] == "text") {
              this.pattern = JSON.stringify(element["pattern"]);
            }
            if (element["type"] == "dropdown") {
              this.value = element["values"].split(',');
            }
          });

        }
        
      });
      console.log(this.value);
    });
  }

  showTypeDefinition() {
    this.definitions.forEach(element => {
      if (element["typeid"] == "typedef") {
        this.root = JSON.parse(element['value']);

        this.data['typedef'].push(this.root['template']);
        // this.editor.set(this.data);
        this.formdata = this.root['properties'];
        this.formdata.forEach(element => {
          if (element["type"] == "dropdown") {
            this.value = element["values"].split(',');

          }
        });
      }
    });
  }

  showUnitDefenition() {
    this.definitions.forEach(element => {
      if (element["typeid"] == "objunitdef") {
        this.root = JSON.parse(element['value']);

        this.data['typedef'][0]['unitvalues'] = this.root['template'];
        // this.editor.set(this.data);
        this.formdata = this.root['properties'];
        this.formdata.forEach(element => {
          if (element["type"] == "dropdown") {
            this.value = element["values"].split(',');
          }
        });
      }
    });
  }

  showUnitValues() {
    this.definitions.forEach(element => {
      if (element["typeid"] == "units") {
        this.root = JSON.parse(element['value']);

        this.data['typedef'][0]['unitvalues']['units'].push(this.root['template']);
        // this.editor.set(this.data);
        this.formdata = this.root['properties'];
        this.formdata.forEach(element => {
          if (element["type"] == "dropdown") {
            this.value = element["values"].split(',');

          }
        });
      }
    });
  }
  dropdown() {
    this.typedefdata.forEach(element => {
      if (element["type"] == "dropdown") {
        this.name = element["name"];
      }
    });
  }
  showButton(ele) {
    var button = document.getElementById(ele) as HTMLButtonElement;
    button.classList.add("show");
  }
  saveTariff(object) {
    object.forEach(element => {
      var name = element['name'];
      var id = document.getElementById(name) as HTMLInputElement;
      if (id != null) {
        this.data[name] = id.value;
      }
      // this.editor.set(this.data);
    });
  }

  jsonClick(elm) {

  }

  onGettariff() {
    this.spinner.show();
    this.service.getTariff().subscribe((Response) => {
      console.log(Response);
      this.tariffdata = Response['Response'][1];
      this.spinner.hide();
    });
  }
  getValueIndex(i: any) {
    this.indexeddata = Array(this.tariffdata[i]);
    this.tariffName = this.indexeddata[0]['tariffname'];
    this.tariffid = this.indexeddata[0]['tariffid'];
    localStorage.setItem('tariffid', JSON.stringify(this.tariffid));

  }
  getParkingSpace() {

    this.parkSpace = [];
    this.parkSpace1 = [];
    this.parkassign = [];
    this.service.getparkAssign(this.tariffid).subscribe((Response) => {
      this.parkassign = Response["Response"][1];
      this.parkassign.forEach((element, key) => {
        if (element["parkingspaceid"] != "") {
          var elm = document.getElementById(element["parkingspaceid"]) as HTMLInputElement;
          if (elm) { elm.checked = true; }
        }
      });
    });
  }

  saveSchemeDefenition() {
    var schememap = new Map();
    var maindiv = document.getElementById('datafield') as HTMLElement;
    var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
    for (var z = 0; z < inputs.length; z++) {
      var div = inputs[z] as HTMLInputElement;
      schememap.set(div.id, (div.value != "array") ? div.value : []);

    }
    let startdate = this.strMapToObj(schememap)['startdate'];
    let enddate = this.strMapToObj(schememap)['enddate'];
    if (enddate <= startdate) {
      this.toastr.warning("Please enter a valid end date!");
      this.resetform();
      return;
    }
    this.service.schemedefinition.tariff = JSON.stringify(this.strMapToObj(schememap));
    localStorage.setItem('schemevalues', JSON.stringify(this.strMapToObj(schememap)));
    this.service.saveTariffSchemedata().subscribe((Response) => {
      this.logcode = Response["Response"][0][0]["_logcode"];
      if (this.logcode == '1740') {
        this.toastr.success("Tariff Created Successfully")
        this.ngOnInit();
      }
      else if (this.logcode == '1742') {
        this.toastr.warning("Tariff Already Exist For the Unit type");
        this.ngOnInit();
      }
      else {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    }, (erro: HttpErrorResponse) => {

      this.toastr.warning("Can't Able to Connect");
    });

  }
  strMapToObj(strMap) {
    let obj = Object.create(null);
    strMap.forEach((K, V) => {
      obj[V] = K;
    });
    return obj;
  }
  getdropdownvalue() {
    var maindiv = document.getElementById('datafield') as HTMLElement;
    var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
    console.log(inputs.length);
    for (var z = 0; z < inputs.length; z++) {
      var select = inputs[z] as HTMLInputElement;
      console.log(select.id);
      if ($('#' + select.id).has('option').length > 0) {
        return;
      }
      this.formdata.forEach(element => {
        if (element['name'] == select.id && element['values'] != undefined) {
          element['values'].split(',').forEach((k, v) => {
            $('#' + select.id).append($("<option></option>")
              .attr("value", k)
              .text(k));
          });
        }
      });
    }
  }
  assignParkSpace(value: any) {
    var itemvalue2 = $('.mycheckbox:checked');
    for (var i = 0; i < itemvalue2.length; i++) {
      this.parkSpace.push(itemvalue2[i]["value"]);
    }

    var itemvalue1 = $('.mycheckbox:not(:checked)');
    for (var i = 0; i < itemvalue1.length; i++) {

      this.parkSpace1.push(itemvalue1[i]["value"]);
    }
    this.service.assignParkingSpace(this.parkSpace, this.tariffid, this.parkSpace1).subscribe((Response) => {
      this.logcode1 = Response["Response1"]["0"]["0"]["_logcode"]
      if (this.logcode1 == '1760') {
        this.toastr.success("ParkingSpace Assigned Successfully")
        this.viewvalue = 1
      }
      else {
        this.toastr.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    }, (erro: HttpErrorResponse) => {

      this.toastr.warning("Can't Able to Connect");
    });
  }

  changeTariffStatus(Data: any) {
    if (Data.isactive == '1') {
      Data.isactive = '0';
      this.count = "1";
    }
    else {
      this.count = "2";
      Data.isactive = '1';
    }
    this.service.changeStatus(Data).subscribe((Response) => {
      this.logcode2 = Response["Response"]["0"]["0"]["_logcode"]
      if (this.logcode2 == '1780') {
        if (this.logcode2 == '1780' && this.count == '1') {
          this.toastr.success("Status Deactivated");
        }
        else if (this.logcode2 == '1780' && this.count == '2') {
          this.toastr.success("Status Activated");
        }
      }
      else {
        this.toastr.error("Something Went Wrong:(");
      }
    });
  }
  getEndPointUnderme() {

    this.service.getEndPointUnderme().subscribe((Response) => {
      this.endpointlogcode = Response["Response"][0][0]["_logcode"];
      if (this.endpointlogcode == "1840") {
        this.endpoint = Response["Response"][1];
      }
    });
  }
  getParkingSpaces(event: any) {

    this.service.orgid = event.target.value;
    this.service.getParkingSpaces().subscribe((Response) => {
      this.parklogcode = Response["Response"][0][0]["_logcode"];
      if (Response["Response"][1].length == 0) {
        this.toastr.warning("No Parking Space Available");
        this.viewvalue = 0
        this.dropvalue = 0
      }
      else {
        this.dropvalue = 1;
      }
      if (this.parklogcode == "1880") {
        this.parkingspace = Response["Response"][1];

        this.getParkingSpace();
      }
    });
  }
  dateFormat() {                 // function for disabling past date from the datepicker
    this.myDate = new Date();
    this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  toggleEditable(event) {
    if (event.target.checked) {
      this.viewvalue = 1;
    } else {
      this.viewvalue = 1;
    }
  }
  parkingLotsAvail(event: any) {    //function for checking whether parking lots are available for a parking space or not
    this.service.parkingspacelotavailid = event.target.value;
    if (event.target.checked) {
      this.service.parkingLotsAvial().subscribe((Response) => {
        this.lotavaillogcode = Response["Response"][0][0]["_logcode"];
        if (this.lotavaillogcode == "1910") {
          this.lotdetails = Response["Response"][1];
          this.lotcount = this.lotdetails[0]["lotcount"];
          if (this.lotcount == "0") {
            this.toastr.warning("parking lots not available please create lots for the space");
            this.viewvalue = 0;
            event.target.checked = false;
          }
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

  }
  checkTariff() {
    this.viewtariffservice.getTariffDetails().subscribe((Response) => {
      let checkdata = Array(Response["Response"][1][0]);
      let checktypedef = Array(checkdata[0]["typedef"]);
      let checktypedefvalue = JSON.parse(checktypedef[0]).length;
      let unitcheckvalue = JSON.parse(checktypedef[0]);
      if (checktypedefvalue != 0) {
        this.viewcount = 1;
      } else {
        this.viewcount = 0;
        // this.toastr.info("Incompleted Traiff")
      }
      unitcheckvalue.forEach(element => {
        let checkunitvalue = element["unitvalues"]["units"].length
        if (checkunitvalue == 0) {                                    // Checking whether units available or not
          this.viewcount = 0;
        }
      });
    });
  }
}
