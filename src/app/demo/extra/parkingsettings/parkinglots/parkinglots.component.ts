import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { ParkinglotsService } from './parkinglots.service';
import { Router, RouterModule } from '@angular/router';
import { VehiclecategoryService } from '../../adminsettings/vehiclecategory/vehiclecategory.service';
import { ToastrService } from 'ngx-toastr';
import { BulkParkLotUpload, CsvData, Parkinglots, PLotsDetailsModel } from './parkinglots.modal';
import { Vehicle } from '../../adminsettings/vehiclecategory/vehiclecategory.modal';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-parkinglots',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgbCarouselModule,
    // FileUploadModule,
    NgxSpinnerModule,
    NgbDropdownModule,
    RouterModule
  ],
  templateUrl: './parkinglots.component.html',
  styleUrl: './parkinglots.component.scss'
})
export default class ParkinglotsComponent implements OnInit {
  PLotDetails: PLotsDetailsModel[];
  logcode: any;
  PLotView: Parkinglots[];
  BParkLot: BulkParkLotUpload; //Ref Var BulkParkingLot
  logcode1: string;
  logcode2: string;
  VehType: Vehicle;
  dtHolidays: any;
  Csv: any = [];
  fileReaded: any;


  // @ViewChild(DataTableDirective)
  @ViewChild('csvReader') csvReader: any;
  // dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject();

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    //showTitle: true,
    useBom: true,
    noDownload: false,
    headers: ["ParkingLotName", "VehicleType"]
  };

  csvContent: string;
  park: string[];
  count: string = '';
  datas: any;
  report: any;
  ParkData: Parkinglots;
  UParkLots: Parkinglots[];
  id: any;
  sensorid: any;
  networkprovider: any;
  editdeviceid: any;
  devicecount: any;
  parkinglotcount: any;
  modalopen: boolean;
  networkid: any;
  savebutton: boolean;
  parkval: boolean;
  buttonview: boolean;
  sensorcount: string;
  button: boolean;
  editbutton: boolean;
  checkbox: boolean;
  checkboxvalue: Parkinglots[];
  parkingslotarray = [];
  clusterarray = [];
  checkassign: boolean;
  slotcount: any;
  public records: any[] = [];
  clustercheck: Parkinglots[];
  ledlight: any;
  constructor(public PLotsSer: ParkinglotsService,
    public toastr: ToastrService,
    public VehicleType: VehiclecategoryService,
    public router: Router,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal) { }
    ngOnInit() {
      this.OnGetPLot();
      this.resetform();
      this.OnGetVehicleType();
      this.onGetParkingList();
      this.button = true;
      this.checkbox = false;
      this.dtHolidays = [
        { "ParkingLotName": '', "VehicleType": '' }
      ];
  
  
  
    }
    addSlots(add: ElementRef) {
      this.modalService.open(add, { size: 'md' });
    }
    addBulk(bulk: ElementRef) {
      this.modalService.open(bulk, { size: 'md' });
    }
    bulkDevice(bulkdevice: ElementRef) {
      this.modalService.open(bulkdevice, { size: 'md' });
    }
    confirmBulk(bulkconfirm: ElementRef) {
      this.modalService.open(bulkconfirm, { size: 'md' });
    }
    generateLayout(layout: ElementRef) {
      this.modalService.open(layout, { size: 'md' });
    }
    addCluster(cluster: ElementRef) {
      this.modalService.open(cluster, { size: 'md' });
    }
    editSlots(edit: ElementRef) {
      this.modalService.open(edit, { size: 'md' });
    }
    resetform(form?: NgForm) {
      this.devicecount = 0;
      this.savebutton = false;
      if (form != null)
        form.resetForm();
      this.PLotsSer.AddParkLot = {
        parking_lot_id: '',
        parkingspaceid: '',
        parkingnumber: '',
        vehtype: '',
        token: '',
        isactive: '',
        parking_lot_name: '',
        vehicletype: '',
        deviceid: '',
        nwproviderid: '',
        devicestatus: '',
        clusterid : ''
  
      }
      this.BParkLot = {
        Token: '',
        ParkSpaceId: '',
        BulkArray: [],
        lotname: []
      }
      this.ParkData = {
        parking_lot_id: '',
        parkingspaceid: '',
        parkingnumber: '',
        vehtype: '',
        token: '',
        isactive: '',
        parking_lot_name: '',
        vehicletype: '',
        deviceid: '',
        nwproviderid: '',
        devicestatus: '',
        clusterid: ''
      },
        this.PLotsSer.BulkdeviceAssign = {
          token: '',
          parkingspaceid: '',
          networkid: '',
          parkingslotid: ''
        },
        this.PLotsSer.slotcount = {
          token: '',
          parkingspaceid: '',
          parkingslotid: '',
          slotname: ''
        },
        this.PLotsSer.selectdevice = {
          token: '',
          parkingslotid: '',
          parkingspaceid: ''
        },
        this.PLotsSer.layoutmodal = {
          token: "",
          parkingspaceid: "",
          layout: ""
        },
        this.PLotsSer.clustermodal = {
          token: "",
          clustername: "",
          clusterid: "",
          parkinglots: []
        }
    }
  
  
    OnGetVehicleType() {
      this.VehicleType.GetVehicleCateory().subscribe((Response) => {
        this.VehType = Response["Response"][1];
      })
    }
  
    OnGetPLot() {
      this.spinner.show();
      this.id = JSON.parse(localStorage.getItem('LotsDetails'));
      this.PLotsSer.lotsid = this.id[0]["parking_lot_id"];
      this.PLotsSer.OnGetPLotSer().subscribe((Response) => {
        this.logcode2 = Response["Response"][0][0]["_logcode"];
        if (this.logcode2 == '1260') {
          this.PLotView = Response["Response"][1];
          this.spinner.hide();
          this.PLotDetails = Response["Response"][2];
          this.networkprovider = Response["Response"][4];
          // this.editdeviceid = Response["Response"][5];
          this.parkinglotcount = Response["Response"][6][0]["count"];
          this.ledlight= Response["Response"][8];
          this.slotcount = this.parkinglotcount;
          $('#mytable1').DataTable().destroy();
          $(document).ready(function () {
            var table = $('#mytable1').DataTable();
            table.draw();
  
          });
        }
        else if (this.logcode2 == '1261') {
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          localStorage.removeItem("LotsDetails");
          this.router.navigate(['login']);
        }
      });
    }
  
    onGetParkingList() {
      this.PLotsSer.GetParkingAreaList()
        .subscribe((Response) => {
          this.datas = Response["Response"][1];
          this.logcode = Response["Response"][0][0]["_logcode"];
          if (this.logcode == '1491') {
            this.toastr.error("Token Expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
        });
    }
  
    OnAddPLot() {
      this.PLotsSer.AddParkLot.parking_lot_id = this.id[0]["parking_lot_id"];
      if (this.PLotsSer.AddParkLot.deviceid != "") {
        if (this.PLotsSer.AddParkLot.devicestatus == '1') {
          this.PLotsSer.AddParkLot.isactive = '1';
        } else {
          this.PLotsSer.AddParkLot.isactive = '0';
        }
      } else {
        this.PLotsSer.AddParkLot.isactive = '1';
      }
      if (this.PLotsSer.AddParkLot.deviceid != "" && this.PLotsSer.AddParkLot.devicestatus == "") {
        this.toastr.info("Device Satus is Mandatory!");
        this.resetform();
        return;
      }
      if (this.PLotsSer.AddParkLot.deviceid != "" && this.PLotsSer.AddParkLot.vehicletype != 'Car') {
        this.toastr.info("Sensor can assign only for Car");
        this.resetform();
        return;
      }
      this.PLotsSer.OnAddPLotSer().subscribe((result) => {
        this.logcode = result["Response"][0][0]["_logcode"];
        if (this.logcode == '1270') {
          this.toastr.success("Parking Slot Created");
          $('#mytable1').DataTable().destroy();
          this.OnGetPLot();
        }
        else if (this.logcode == "1272") {
          this.toastr.warning("Parking Slot Name Already Exist");
        }
        else if (this.logcode == '1271') {
  
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
  
        }
      },
        (erro: HttpErrorResponse) => {
          this.toastr.warning("Can't Able to Connect with DataBase");
        }
      );
      this.resetform();
      //this.PLotsSer.AddParkLot.parkingnumber='';
    }
  
    StatusCheck(PLotStatus: Parkinglots) {
  
      PLotStatus.parking_lot_id = PLotStatus.parking_lot_id;
      if (PLotStatus.isactive == '1') {
        PLotStatus.isactive = '0';
        this.count = '1';
      }
      else {
        this.count = "2";
        PLotStatus.isactive = '1';
      }
  
      this.PLotsSer.OnChangeStatusPLot(PLotStatus).subscribe((result) => {
        this.logcode1 = result["Response"][0][0]["_logcode"]
        if (this.logcode1 == '1280') {
          if (this.logcode1 == '1280' && this.count == '1') {
            this.toastr.success("Status Deactivated");
          }
          else if (this.logcode1 == '1280' && this.count == '2') {
            this.toastr.success("Status Activated");
          }
  
  
        }
        else if (this.logcode1 == '1281') {
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
  
        }
      },
        (erro: HttpErrorResponse) => {
          this.toastr.warning("Can't Able to Connect With DataBase");
        });
    }
  
    GetPAValue(i: any) {
      this.buttonview = true;
      this.editbutton = true;
      this.UParkLots = Array(this.PLotView[i]);
        console.log(this,this.UParkLots);
    }
    OnAddBulkLot() {
      this.BParkLot.ParkSpaceId = this.id[0]["parking_lot_id"];
      this.PLotsSer.OnBulkPLotSer(this.BParkLot).subscribe((result) => {
        this.logcode = result["Response"][0][0]["_logcode"]
        if (this.logcode == '1270') {
          this.toastr.success("Parking Lot Created");
          $('#mytable').DataTable().destroy();
          this.OnGetPLot();
        }
        else if (this.logcode == "1272") {
  
          this.toastr.info("ParkingLotName Already Exist");
        }
        else if (this.logcode == '1271') {
  
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
  
        }
      },
        (erro: HttpErrorResponse) => {
          this.toastr.warning("Can't Able to Connect with DataBase");
        }
      );
      this.resetform();
    }
  
    ParkingArea(ParkData: Parkinglots) {
      this.PLotsSer.OnGetParkAreaOnly(ParkData)
        .subscribe((Response) => {
          this.PLotView = Response["Response"][1];
        });
    }
  
    OnUpdate(slotdetails: Parkinglots) {
      if (slotdetails.deviceid != "") {
        if (slotdetails.devicestatus == '1') {
          slotdetails.isactive = '1';
        } else {
          slotdetails.isactive = '1';
        }
      } else {
        slotdetails.isactive = '1';
      }
      if (slotdetails.deviceid != null) {
        if (slotdetails.devicestatus == '1') {
          slotdetails.isactive = '1';
        } else {
          slotdetails.isactive = '1';
        }
      } else {
        slotdetails.isactive = '1';
        slotdetails.deviceid = '';
        slotdetails.devicestatus = '';
        slotdetails.nwproviderid = '';
      }
      if (slotdetails.deviceid != "" && slotdetails.devicestatus == null) {
        this.toastr.info("Device Satus is Mandatory!");
        this.ngOnInit();
        return;
      }
      if (slotdetails.deviceid != "" && slotdetails.vehicletype != "Car") {
        this.toastr.info("Sensor can assign only for Car");
        this.ngOnInit();
        return;
      }
      this.PLotsSer.OnUpdateparkingSlots(slotdetails).subscribe((result) => {
        this.logcode = result["Response"][0][0]["_logcode"]
        if (this.logcode == '1590') {
          this.toastr.success("Updated Successfully");
          //  this.rerender();
          //  this.OnGetPLot();
        } else if (this.logcode == '1592') {
          this.toastr.warning("Device already assigned!Please select another");
          $('#mytable1').DataTable().destroy();
          this.OnGetPLot();
        } else if (this.logcode == '1593') {
          this.toastr.warning("Parking Slot name already exist,Please try different one");
          $('#mytable1').DataTable().destroy();
          this.OnGetPLot();
        }
        else {
          this.toastr.error("Something Went Wrong");
        }
      },
        (erro: HttpErrorResponse) => {
  
          this.toastr.warning("Can't Able to Connect");
        });
    }
    //Finction for downloading csv file 
    downloadCSV() {
      new AngularCsv(this.dtHolidays, "ParkingLotName", this.csvOptions);
    }
    convertFile(fileInput: any) {    // function for converting the csv file and uploading 
  
      this.fileReaded = fileInput.target.files[0];
  
      let reader: FileReader = new FileReader();
      reader.readAsText(this.fileReaded);
  
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = csv.split(/\r\n|\n/);
        let headers = allTextLines[0].split(',');
        let lines = [];
        let lot = [];
        let veh = [];
  
  
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
        }
        this.Csv = lines;
  
        for (let i = 1; i < this.Csv.length; i++) {
          veh.push(this.Csv[i][1]);
          lot.push(this.Csv[i][0]);
        }
        // this.BParkLot.lotname=lot;
        // this.BParkLot.BulkArray=veh;
  
        for (let j = 0; j < veh.length; j++) {
          this.BParkLot.lotname = lot[j];
          this.BParkLot.BulkArray = veh[j];
          this.BParkLot.ParkSpaceId = this.id[0]["parking_lot_id"];
          this.PLotsSer.OnBulkPLotSer(this.BParkLot).subscribe((Response) => {
            this.logcode2 = Response["Response"][0][0]["_logcode"];
            if (this.logcode2 == '1482') {
              this.toastr.error("Parkingslot already exist");
              this.toastr.error("Vehicletype already exist");
              return;
            }
            else if (this.logcode2 == '1481') {
              this.toastr.error("Session Timeout");
              localStorage.removeItem("access_token");
              localStorage.removeItem("orgid");
              localStorage.removeItem("Role");
              localStorage.removeItem("privilege");
              this.router.navigate(['login']);
            }
            else if (this.logcode2 == '1480') {
              this.toastr.success("Parkngslot Created");
              // this.toastr.success("VehicleType :"+" "+ this.BParkLot.BulkArray[j] +" "+"Is Already Exist");
              this.OnGetPLot();
            }
          });
        }
        $('#mytable1').DataTable().destroy();
        // this.OnGetPLot();
      }
  
    }
  
    checkDeviceInnetwork() {
      this.PLotsSer.getdeviceUnderNetwork().subscribe((Response) => {
        var deviceinnetworklog = Response["Response"][0][0]["_logcode"];
        if (deviceinnetworklog == '2130') {
          this.devicecount = Response["Response"][1][0]["count"];
        }
        if (this.devicecount == '0') {
          this.toastr.warning("Sensor not available!");
          this.savebutton = false;
        } else {
          this.savebutton = true;
        }
      });
    }
    checkDeviceCount() {  //Function for checking device count and parkinglotcount
      this.modalopen = false;
      if (this.devicecount < this.parkinglotcount) {
        this.modalopen = true;
      } else {
        return (this.checkassign ? this.selectedParkingSlotSensorAssign() : this.autoAssignSensor());
        // this.autoAssignSensor();
      }
    }
    autoAssignSensor() {    //Function for assigning sensors automatically
      this.PLotsSer.BulkdeviceAssign.parkingspaceid = this.id[0]["parking_lot_id"];
      this.PLotsSer.autoAssignSensortoLot().subscribe((Response) => {
        var autoassignlog = Response["Response"][0][0]["_logcode"];
        if (autoassignlog == '2120') {
          this.toastr.success("Sensors Assigned Successfully!");
          $('#mytable1').DataTable().destroy();
          this.OnGetPLot();
        } else {
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
  
      });
    }
  
    checkParkingSlot() {   //function for checking whether parking slot is not available
      if (this.parkingslotarray.length != 0) {
        this.parkinglotcount = this.parkingslotarray.length;
        this.checkassign = true;
      } else {
        this.checkassign = false;
        this.parkinglotcount = this.slotcount;
      }
      if (this.parkinglotcount == '0') {
        this.toastr.warning("Parking Slot is not available for sensor allocation!");
        this.parkval = false;
      } else {
        this.parkval = true;
      }
    }
    countParkingSlot(event: any) {
      this.PLotsSer.slotcount.parkingslotid = this.UParkLots[0]["parkingid"];
      this.PLotsSer.slotcount.parkingspaceid = this.UParkLots[0]["parking_lot_id"];
      this.PLotsSer.slotcount.slotname = event.target.value;
      this.PLotsSer.countParkingSlot().subscribe((Response) => {
        var countlog = Response["Response"][0][0]["_logcode"];
        if (countlog == '2140') {
          var slotcount = Response["Response"][1][0]["count"];
          if (slotcount != 0) {
            this.buttonview = false;
            this.toastr.warning("Slot name already exist,Please try different one");
          } else {
            this.buttonview = true;
          }
        } else {
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
    selectDevicesinNetwork(event: any) {   //for adding parking slots
      this.PLotsSer.BulkdeviceAssign.networkid = event.target.value;
      this.PLotsSer.getdeviceUnderNetwork().subscribe((Response) => {
        var devicelog = Response["Response"][0][0]["_logcode"];
        if (devicelog == '2130') {
          this.sensorcount = Response["Response"][1][0]["count"];
          this.sensorid = Response["Response"][2];
          //  this.editdeviceid =Response["Response"][3];
        }
        if (this.sensorcount == '0') {
          this.button = false;
          this.toastr.warning("Sensor not available!");
        } else {
          this.button = true;
        }
      });
    }
    selectDeviceinNetworkForEdit(event: any) {  //for editing parking slot
      this.PLotsSer.BulkdeviceAssign.networkid = event.target.value;
      this.PLotsSer.getdeviceUnderNetwork().subscribe((Response) => {
        var devicelogedit = Response["Response"][0][0]["_logcode"];
        if (devicelogedit == '2130') {
          this.editdeviceid = Response["Response"][2];
        }
        if (this.editdeviceid.length == '0') {
          this.toastr.warning("No sensor available");
          this.editbutton = false;
        } else {
          this.editbutton = true;
        }
      });
    }
    findDevice() {
      this.PLotsSer.selectdevice.parkingslotid = this.UParkLots[0]["parkingid"];
      this.PLotsSer.selectdevice.parkingspaceid = this.UParkLots[0]["parking_lot_id"];
      this.PLotsSer.getSensorOnParkingSlot().subscribe((Response) => {
        var deviceonslotlog = Response["Response"][0][0]["_logcode"];
        if (deviceonslotlog == '2150') {
          this.editdeviceid = Response["Response"][1];
        } else {
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
    selectAll(event: any) {
      if (event.target.checked) {
        this.checkbox = true;
      } else {
        this.checkbox = false;
      }
  
    }
    getCheckBoxValue(i: any, event: any) {  //function for getting the check box value and unchecking it
      this.checkboxvalue = Array(this.PLotView[i]);
      var parkingslotid = this.checkboxvalue[0]["parkingid"];
      let vehtype = this.checkboxvalue[0]["vehicletype"];
      let deviceid = this.checkboxvalue[0]["deviceid"];
      let clustid = this.checkboxvalue[0]["clusterid"];
      console.log(clustid);
      if (vehtype != "Car" || clustid!=null) {
        event.target.checked = false;
      } if (event.target.checked) {
        this.parkingslotarray.push(parkingslotid);
      }
      if (!event.target.checked) {
        for (var j = 0; j < this.parkingslotarray.length; j++) {
          if (parkingslotid == this.parkingslotarray[j]) {
            this.parkingslotarray.splice(j, 1);
          }
        }
      }
    }
    uncheck(event: any) {
      if (!event.target.checked) {
      }
    }
    selectedParkingSlotSensorAssign() { //api call for assigning sensors to checked parking slots
      for (var k = 0; k < this.parkingslotarray.length; k++) {
        this.PLotsSer.BulkdeviceAssign.parkingspaceid = this.id[0]["parking_lot_id"];
        this.PLotsSer.BulkdeviceAssign.parkingslotid = this.parkingslotarray[k];
        this.PLotsSer.autoSensortoCheckedSlots().subscribe((Response) => {
          var checklog = Response["Response"][0][0]["_logcode"];
          if (checklog == '2160') {
            this.toastr.success("Sensor assigned successfully");
            this.OnGetPLot();
            this.resetform();
          } else {
            this.toastr.error("Session TimeOut");
            localStorage.removeItem("access_token");
            localStorage.removeItem("orgid");
            localStorage.removeItem("Role");
            localStorage.removeItem("privilege");
            this.router.navigate(['login']);
          }
        });
      }
      this.parkingslotarray = [];
      this.devicecount = 0;
    }
    uploadListener($event: any): void {  //function for proccessing the csv file......................
      let text = [];
      let files = $event.srcElement.files;
      if (this.isValidCSVFile(files[0])) {
        let input = $event.target;
        let reader = new FileReader();
        reader.readAsText(input.files[0]);
  
        reader.onload = () => {
          let csvData = reader.result;
          let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
          let headersRow = this.getHeaderArray(csvRecordsArray);
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
          this.PLotsSer.layoutmodal.layout = JSON.stringify(this.records);
        };
        reader.onerror = function () {
          console.log("error is occured while reading file!");
        }
      } else {
        this.toastr.warning("Please import valid . csv file.");
        this.fileReset();
      }
    }
    isValidCSVFile(file: any) {  //checking extension for validating CSV file 
      return file.name.endsWith(".csv");
    }
    getHeaderArray(csvRecordsArr: any) {  //function for getting the csv headers and returning it
      let headers = (<string>csvRecordsArr[0]).split(',');
      let headerArray = [];
      for (let j = 0; j < headers.length; j++) {
        headerArray.push(headers[j]);
      }
      return headerArray;
    }
    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
      let csvArr = [];
      for (let i = 1; i < csvRecordsArray.length; i++) {
        let curruntRecord = (csvRecordsArray[i]).split(',');
        if (curruntRecord.length == headerLength) {
          let csvRecord: CsvData = new CsvData();
          csvRecord.row = curruntRecord[0].trim();
          csvRecord.column = curruntRecord[1].trim();
          csvRecord.value = curruntRecord[2].trim();
          csvRecord.number = curruntRecord[3].trim();
          csvRecord.direction = curruntRecord[4].trim();
          csvRecord.road = curruntRecord[5].trim();
          csvRecord.spot = curruntRecord[6].trim();
          csvRecord.path = curruntRecord[7].trim();
          csvArr.push(csvRecord);
        }
      }
      return csvArr;
    }
  
    fileReset() {  // for resetting the csv reader...............
      this.csvReader.nativeElement.value = "";
      this.records = [];
    }
    saveParkingSpacelayout() {
      this.PLotsSer.layoutmodal.parkingspaceid = this.id[0]["parking_lot_id"];
      this.PLotsSer.saveLayout().subscribe((Response) => {
        let layoutlog = Response["Response"][0][0]["_logcode"];
        if (layoutlog == '2560') {
          this.toastr.success("parkingspace layout added successfully");
          this.fileReset();
        } else {
          this.toastr.error("Session TimeOut");
          localStorage.removeItem("access_token");
          localStorage.removeItem("orgid");
          localStorage.removeItem("Role");
          localStorage.removeItem("privilege");
          this.router.navigate(['login']);
        }
      });
    }
  
    getCheckBoxValueForCluster(i: any, event: any) {  //function for creating array of checked parking slotd for creating cluster
      this.clustercheck = Array(this.PLotView[i]);
      var parkingslotid = this.clustercheck[0]["parkingid"];
      let vehtype = this.clustercheck[0]["vehicletype"];
      let deviceid = this.clustercheck[0]["deviceid"];
      let clustid = this.clustercheck[0]["clusterid"];
      console.log(vehtype)
      console.log(deviceid);
      console.log(clustid);
      if (clustid!="" && clustid!=null) {
        event.target.checked = false;
      } if (event.target.checked) {
        this.clusterarray.push(parkingslotid);
      }
      if (!event.target.checked) {
        for (var j = 0; j < this.clusterarray.length; j++) {
          if (parkingslotid == this.clusterarray[j]) {
            this.clusterarray.splice(j, 1);
          }
        }
      }
    }
    createCluster() {
      if (this.clusterarray.length == 0) {
        this.toastr.info("Please Select Parking Slots!");
      } else {
        this.PLotsSer.createCluster().subscribe((Response) => {
          let clusterlog = Response["Response"][0][0]["_logcode"];
          if (clusterlog == '2780') {
            this.PLotsSer.clusterid = this.PLotsSer.clustermodal.clusterid;
            for (var l = 0; l < this.clusterarray.length; l++) {
              this.PLotsSer.lotid = this.clusterarray[l];
              this.PLotsSer.updateClusterID().subscribe((Response) => {
                let updatelog = Response["Response"][0][0]["_logcode"];
                if (updatelog == '2790') {
                  console.log("Clusterid updated!");
                  this.OnGetPLot();
                  this.resetform();
                } else {
                  console.log("Error!");
                }
              });
            }
            this.toastr.success('Cluster Created!');
            this.parkingslotarray = [];
            this.devicecount = 0;
            this.clusterarray = [];
          } else if (clusterlog == '2782') {
            this.toastr.info("Cluster id already exist, Please try fifferent one");
          } else {
            this.toastr.error("Session TimeOut");
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
