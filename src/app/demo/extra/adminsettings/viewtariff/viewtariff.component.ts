import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { ViewtariffService } from './viewtariff.service';
import { SettariffService } from '../settariff/settariff.service';
@Component({
  selector: 'app-viewtariff',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    SharedModule,
    RouterModule
  ],
  providers:[DatePipe],
  templateUrl: './viewtariff.component.html',
  styleUrl: './viewtariff.component.scss'
})
export default class ViewtariffComponent implements OnInit {
 
  @ViewChild('buttonClick') buttonClick: ElementRef;
  tariffdata: any;
  typedef: [];
  button: any;
  indexeddata: any[];
  accumulatecharge: any;
  unitvalues: any;
  unittype: string;
  editType = false;
  editUnit = false;
  typedefindex: any;
  checktypedef: any[];
  typedefcheckvalue: any;
  unitcheckvalues: any;
  checkunitvalue: any;
  usedcount: any;
  typedefvalue: any;
  definitions: any;
  root: any;
  data: any;
  formdata: any;
  value: [];
  typedefdata: any;
  unitvalue: any;
  unitvaluedata: any;
  unitdatavalue: any;
  unitindex: any;
  unitIndex: any[];
  logcode1: any;
  viewvalue: number;
  logcode3: any;
  deletetypedeflog: any;
  logcode: any;
  logcode2: any;
  unitindexedit: any;
  logcode4: any;
  myDate: any;
  constructor(public service: ViewtariffService, public settariffservice: SettariffService, public toastr: ToastrService,
    public datepipe: DatePipe, public spinner:NgxSpinnerService,public router: Router,public modalService: NgbModal) { }
    ngOnInit() {
      this.onGettariff();
      this.getTariffDef();
      this.resetform();
      this.initialbuttonClick();
    }
    resetform(form?: NgForm) {
      this.service.updatetariff = {
        token: "",
        tariffid: "",
        tariff: "",
        tariffname: "",
      },
        this.settariffservice.schemedefinition = {
          parkingspaceid: "",
          tariffname: "",
          tariff: "",
          token: ""
        }
    }
    addTariffVariation(addvariation: ElementRef) {
      this.modalService.open(addvariation, { size: 'md' });
    }
    addUnitValue(addunitvalue: ElementRef) {
      this.modalService.open(addunitvalue, { size: 'md' });
    }
    editTariff(edit: ElementRef) {
      this.modalService.open(edit, { size: 'md' });
      setTimeout(() => {
        this.getdropdownvalueScheme();
      }, 100);
    }
    deleteType(deletetype: ElementRef) {
      this.modalService.open(deletetype, { centered: true });
    }
    deleteUnit(deleteunit: ElementRef) {
      this.modalService.open(deleteunit, { centered: true });
    }
    buttonclick() {
      var buttonindex = this.typedefindex;
      document.getElementById(buttonindex).click();
    }
  
    onGettariff() {
      this.spinner.show();
      this.service.getTariffDetails().subscribe((Response) => {
        this.tariffdata = Array(Response['Response'][1][0]);
        this.spinner.hide();
        this.checktypedef = Array(this.tariffdata[0]["typedef"]);
        this.typedefcheckvalue = JSON.parse(this.checktypedef[0]).length
        this.unitcheckvalues = JSON.parse(this.checktypedef[0]);
        if(this.typedefcheckvalue == 0){                                     //Checking whether typedefenition available or not
          this.toastr.warning("Incompleted Typedef");
        }else{
         
        }
        this.unitcheckvalues.forEach(element=>{
          this.checkunitvalue = element["unitvalues"]["units"].length
          if(this.checkunitvalue == 0){                                    // Checking whether units available or not
            this.toastr.warning("incompleted units");
          }
        })
        this.usedcount = Response["Response"][2][0]["usedcount"];
        this.unittype = this.tariffdata[0]['unittype'];
        this.typedefvalue = JSON.parse(this.tariffdata[0]['typedef']);
        this.button = [];
        this.button.length = this.typedefvalue.length;
        for (var i = 0; i < this.typedefvalue.length; i++) {
          this.button[i] = this.typedefvalue[i]['vehtype'];
        }
        setTimeout(() => {
          if (this.button.length > 0) {
            var buttonindex = this.typedefindex;
             document.getElementById(buttonindex).click();
          }
        }, 500);
        
      });
    }
  
    getValueIndex(i: any) {
      this.typedefindex = i;
      var btns = document.getElementsByClassName('btn') as HTMLCollectionOf<Element>;
      for (var j = 0; j < btns.length; j++) {
        btns[j].classList.add("color");
      }
      var current = document.getElementById(i);
      current.classList.toggle('color');
  
      this.indexeddata = Array(this.typedefvalue[i]);
      this.accumulatecharge = this.indexeddata[0]["unitvalues"]["accumulatecharges"];
      this.unitvalues = this.indexeddata[0]["unitvalues"]["units"];
    }
    getTariffDef() {
      this.service.getTariffDefenition().subscribe((Response) => {
        this.definitions = Response['Response'][1];
        this.definitions.forEach(element => {
          if (element["typeid"] == "root") {
            this.root = typeof element['value'] === 'string' 
  ? JSON.parse(element['value']) 
  : element['value'];
            this.data = this.root["template"];
            this.formdata = this.root['properties']; // variable stores the defenitions for root element 
            this.formdata.forEach(element => {
              if (element["type"] == "dropdown") {
                this.value = element["values"].split(','); //split values for the options field 
              }
  
            });
          }
          if (element["typeid"] == "typedef") {
            // this.typedef = JSON.parse(element['value']);
             this.typedef = typeof element['value'] === 'string' 
  ? JSON.parse(element['value']) 
  : element['value'];
            this.typedefdata = this.typedef["properties"]; //variable stores the defenitions for typedefenition fields
          }
          if (element["typeid"] == "units") {
            // this.unitvalue = JSON.parse(element['value']);
            this.unitvalue = typeof element['value'] === 'string' 
  ? JSON.parse(element['value']) 
  : element['value'];
            this.unitvaluedata = this.unitvalue["properties"];
            this.unitvaluedata.forEach(element => {
              if (element["type"] == "dropdown") {
                this.unitdatavalue = element["values"].split(','); //split values for the options field 
              }
  
            });
          }
        });
      });
    }
  
    getdropdownvalue() {
    
      var maindiv = document.getElementById('datafield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var z = 0; z < inputs.length; z++) {
        var select = inputs[z] as HTMLInputElement;
        if ($('#' + select.id).has('option').length > 0) {
          return;
        }
        this.typedefdata.forEach(element => { 
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
    getIndex(k: any) {
      this.unitindex = k;
      this.unitIndex = Array(this.unitvalues[k]);
    }
    // adding New Type DeFinition..........................................................
    updateTypedef() {
      var template = this.typedef['template'];
      var maindiv = document.getElementById('datafield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var z = 0; z < inputs.length; z++) {
        var div = inputs[z] as HTMLInputElement;
        if (typeof (template[div.id]) === 'string') {
          template[div.id] = div.value;
        }
        if (div.id == 'accumulatecharges') {
          template['unitvalues'][div.id] = div.value;
        }
      }
      //validation code
      let typedefvalues = JSON.parse(this.tariffdata[0]['typedef']);
      for (let i = 0; i < typedefvalues.length; i++) {
        if (typedefvalues[i]['pktype'] == template['pktype'] && typedefvalues[i]['vehtype'] == template['vehtype']
          && typedefvalues[i]['custtype'] == template['custtype']) {
          this.toastr.warning("Same tariff variation already exists");
          return;
        }
      }
      let typedefindex = JSON.parse(this.tariffdata[0]['typedef']);
      typedefindex.push(template);
      this.tariffdata[0]['typedef'] = typedefindex;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      this.service.updateTariff().subscribe((Response) => {
        this.logcode1 = Response["Response"]["0"]["0"]["_logcode"];
        if (this.logcode1 == "1750") {
          this.toastr.success("Saved Successfully")
          this.viewvalue=1;
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
  
      });
    }
   // Function for adding new units
    updateunitdef() { 
      var unitmap = new Map();
      var maindiv = document.getElementById('unitfield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var z = 0; z < inputs.length; z++) {
        var div = inputs[z] as HTMLInputElement;
        unitmap.set(div.id, (div.value != "array") ? div.value : []);
      }
      var unitIndex = JSON.parse(this.tariffdata[0]['typedef']);
      var len = unitIndex[this.typedefindex]['unitvalues']['units'].length;
      for (var j = 0; j < len; j++) {
        var unitend = unitIndex[this.typedefindex]['unitvalues']['units'][j]['unitend'];
        var chargingmethod = unitIndex[this.typedefindex]['unitvalues']['units'][j]['chargingmethod'];
        let countC = 0;
        if (this.strMapToObj(unitmap)['chargingmethod'] == 'Cumulative') {
          if (chargingmethod == this.strMapToObj(unitmap)['chargingmethod']) {
            countC++;
            if (countC == 1) {
              this.toastr.warning("Cumulative already exist")
              return;
            }
          } else {
           
          }
        }
        let unitstart = unitIndex[this.typedefindex]['unitvalues']['units'][j]['unitstart']; // value already stored as unitstart
        if (unitIndex[this.typedefindex]['unitvalues']['units'][j]['chargingmethod'] == 'Fixed') {
          var unitend = unitIndex[this.typedefindex]['unitvalues']['units'][j]['unitend']; // value already stored as unit end
        }
        let starttime = this.strMapToObj(unitmap)['unitstart']; // value entered by the user start date
        let endtime = this.strMapToObj(unitmap)['unitend'];  //value entered by the user as enddate
        if (this.strMapToObj(unitmap)['chargingmethod'] == 'Fixed') {
          if (starttime < unitend && len == j + 1) {
            this.toastr.warning("Please enter a valid unit start");
            return;
          }
          if (JSON.parse(endtime)<= JSON.parse(starttime)) {
            this.toastr.warning("Please enter a valid unit end");
            return;
          }
          if(len!=0 && starttime!=unitend && len == j+1){
            this.toastr.warning("Invalid unit start");
            return;
          }
        }
  
      }
      unitIndex[this.typedefindex]['unitvalues']['units'].push(this.strMapToObj(unitmap));
      this.tariffdata[0]['typedef'] = unitIndex;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      this.service.updateTariff().subscribe((Response) => {
        this.logcode3 = Response["Response"]["0"]["0"]["_logcode"];
        if (this.logcode3 == "1750") {
          this.toastr.success("Saved Successfully")
          this.onGettariff();
          // this.buttonclick();
        }
        else {
          this.toastr.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
  
    strMapToObj(strMap) {
      let obj = Object.create(null);
      strMap.forEach((K, V) => {
        obj[V] = K;
      });
      return obj;
  
    }
    deleteTypedefinition(i: number) {
      var typedefindex = JSON.parse(this.tariffdata[0]['typedef']);
      typedefindex.splice(i, 1);
      this.tariffdata[0]['typedef'] = typedefindex;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      this.service.updateTariff().subscribe((Response) => {
         this.deletetypedeflog = Response["Response"][0][0]["_logcode"];
         if(this.deletetypedeflog == '1750'){
           this.ngOnInit();
         }
        
      });
    }
    deleteUnits(k: number) {
  
      var unitIndex = JSON.parse(this.tariffdata[0]['typedef']);
      unitIndex[this.typedefindex]['unitvalues']['units'].splice(k, 1);
      this.tariffdata[0]['typedef'] = unitIndex;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updateTariff().subscribe((Response) => {
        this.onGettariff();
      });
    }
  
    //here starts edit functions
    editScheme(data) {
      console.log(data)
      var maindiv = document.getElementById('schemefield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var y = 0; y < inputs.length; y++) {
        var div = inputs[y] as HTMLInputElement;
        Object.keys(data).forEach(key => {
          if (key == div.id) {
            div.value = data[div.id];
          }
        });
      }
      $('#text').prop('required', true);
      // document.getElementsByName("text").required = true;
    }
    updateScheme() { //updating the type variations
      var data1 = [];
      Object.keys(this.data).forEach(key => {
        data1.push(key);
      });
      var maindiv = document.getElementById('schemefield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var w = 0; w < inputs.length; w++) {
        var div = inputs[w] as HTMLInputElement;
        data1.forEach(key => {
          if (typeof (this.data[key]) === 'string') {
            this.tariffdata[0][div.id] = div.value;
          }
          if (div.id == 'typedef') {
            this.tariffdata[0][div.id] = JSON.parse(div.value);
          }
  
        });
      }
      var startdate = this.tariffdata[0]['startdate'];
      var enddate = this.tariffdata[0]['enddate'];
      if (enddate <= startdate) {
        this.toastr.warning("Please enter a valid end date!");
        this.ngOnInit();
        return;
      }
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      this.service.updateTariff().subscribe((Response) => {
        this.logcode = Response["Response"]["0"]["0"]["_logcode"];
        if (this.logcode == "1750") {
          this.toastr.success("Updated Successfully")
          this.onGettariff();
        }
        else {
          this.toastr.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
  
      });
    }
    updateSchemeEnddate(event: any) {     //function for editing the end date for Used tariff
     
      this.tariffdata[0]['enddate'] = event.target.value;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      if(typeof(this.tariffdata[0]["typedef"])==='string'){
        this.tariffdata[0]["typedef"]=JSON.parse(this.tariffdata[0]["typedef"])
      }
      
      this.service.updateTariff().subscribe((Response) => {
        this.logcode = Response["Response"]["0"]["0"]["_logcode"];
        if (this.logcode == "1750") {
          this.toastr.success("Updated Successfully")
          this.onGettariff();
        }
        else {
          this.toastr.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
  
      });
    }
    editTypeDef(object, accumulatecharge) { //binding the corresponding value of typedef definition to the dropdown list
      this.editType = true;
      var maindiv = document.getElementById('datafield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var w = 0; w < inputs.length; w++) {
        var div = inputs[w] as HTMLInputElement;
        Object.keys(object).forEach(key => {
          if (key == div.id) {
            div.value = object[div.id];
          }
        });
        if (div.id == 'accumulatecharges') {
          div.value = accumulatecharge;
        }
      }
    }
    //updating the edited values in existing typedef
    editTypeDefValue() {
      var typedefkey = [];
      var typedef = JSON.parse(this.tariffdata[0]['typedef']);
      Object.keys(typedef[this.typedefindex]).forEach(key => {
        typedefkey.push(key);
      });
      var maindiv = document.getElementById('datafield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var z = 0; z < inputs.length; z++) {
        var div = inputs[z] as HTMLInputElement;
        typedefkey.forEach(element => {
          if (element == div.id && div.id != 'unitvalues') {
            typedef[this.typedefindex][div.id] = div.value;
          }
          if (div.id == 'accumulatecharges') {
            typedef[this.typedefindex]['unitvalues'][div.id] = div.value;
          }
        });
      }
      //validation 
      for (let i = 0; i < typedef.length; i++) {
        if (i != this.typedefindex) {
          if (typedef[i]['pktype'] == typedef[this.typedefindex]['pktype'] && typedef[i]['vehtype'] == typedef[this.typedefindex]['vehtype']
            && typedef[i]['custtype'] == typedef[this.typedefindex]['custtype']) {
            this.toastr.warning("Same tariff variation already exists");
            return;
          }
        }
      }
      this.tariffdata[0]['typedef'] = typedef;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      this.service.updateTariff().subscribe((Response) => {
        this.logcode2 = Response["Response"]["0"]["0"]["_logcode"];
        if (this.logcode2 == "1750") {
          this.toastr.success("Updated Successfully")
          this.onGettariff();
        }
        else {
          this.toastr.error("Token Expired");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
  
      });
    }
  
    editUnits(unit, k) {  //binding the corresponding values of units to the dropdown list
      this.editUnit = true;
      this.unitindexedit = k;
      var maindiv = document.getElementById('unitfield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var v = 0; v < inputs.length; v++) {
        var div = inputs[v] as HTMLInputElement;
        Object.keys(unit).forEach(key => {
          if (key == div.id) {
            div.value = unit[div.id];
          }
        });
      }
    }
    editUnitsValue() {
      var keys = [];
      var typedef = JSON.parse(this.tariffdata[0]['typedef']);
      var units = typedef[this.typedefindex]['unitvalues']['units'][this.unitindexedit];
      Object.keys(units).forEach(key => {
        keys.push(key);
      });
      var maindiv = document.getElementById('unitfield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var v = 0; v < inputs.length; v++) {
        var div = inputs[v] as HTMLInputElement;
        keys.forEach(element => {
          if (div.id == element) {
            units[div.id] = div.value;
          }
        });
      }
      var editstart = units['unitstart'];
      var editend = units['unitend'];
      var chargingmethod = units['chargingmethod'];
      var len = this.indexeddata[0]['unitvalues']['units'].length;
      if (chargingmethod == "Cumulative") {
        for (var k = 0; k < len; k++) {
          var cMethod = this.indexeddata[0]['unitvalues']['units'][k]['chargingmethod'];
          if (chargingmethod == cMethod && this.unitindexedit != k) { //for updating the existing cumulative
            this.toastr.warning('Cumulative already exist');
            return;
          }
        }
      }
       if(editend<editstart){
         this.toastr.warning("Invalid unit end! Plese enter a valid one");
         return;
       }
        typedef[this.typedefindex]['unitvalues']['units'][this.unitindexedit] = units;
        this.tariffdata[0]['typedef'] = typedef;
        this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
        this.service.updatetariff.tariff = this.tariffdata[0];
        this.service.updateTariff().subscribe((Response) => {
          this.logcode4 = Response["Response"]["0"]["0"]["_logcode"];
          if (this.logcode4 == "1750") {
            this.toastr.success("Updated Successfully")
            this.onGettariff();
            
          }
          else {
            this.toastr.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
        });
    }
    getdropdownvalueScheme() {
      var maindiv = document.getElementById('schemefield') as HTMLElement;
      var inputs = maindiv.getElementsByClassName('myinput') as HTMLCollection;
      for (var z = 0; z < inputs.length; z++) {
        var select = inputs[z] as HTMLInputElement;
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
  
    deletelastValue() {
      var rows = document.getElementById("unittable").getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;
      var unitIndex = JSON.parse(this.tariffdata[0]['typedef']);
      unitIndex[this.typedefindex]['unitvalues']['units'].pop();
      this.tariffdata[0]['typedef'] = unitIndex;
      this.service.updatetariff.tariff = this.tariffdata[0];
      this.service.updatetariff.tariffname = this.tariffdata[0]['TariffName'];
      this.service.updateTariff().subscribe((Response) => {
        this.onGettariff();
      });
    }
    lastaddedunit() {
      var typedefdata = JSON.parse(this.tariffdata[0]['typedef']);
      var index = this.typedefindex;
      var units = typedefdata[index];
      var length = units['unitvalues']['units'].length;
      var lastunitprice = units['unitvalues']['units'][length - 1]['unitend'];
      (<HTMLInputElement>document.getElementById("unitstart")).value = lastunitprice; // setting units value start time as previous unit value end time
      (<HTMLInputElement>document.getElementById("unitend")).value = "";
      (<HTMLInputElement>document.getElementById("price")).value = "";
    }
    initialbuttonClick() {
      setTimeout(() => {
        if (this.button.length > 0) {
          this.buttonClick.nativeElement.click();
        }
      }, 500);
    }
    dateFormat() {
      this.myDate = new Date();
      this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
    }
}
