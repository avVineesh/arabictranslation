import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
import {NgbCarouselModule,NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { OrgfunctionalmapService } from './orgfunctionalmap.service';
import { Router } from '@angular/router';
// import { NgxTreeviewModule } from '@tech-pro/ngx-treeview';
// import { TreeViewModule } from '@syncfusion/ej2-angular-navigations'
@Component({
  selector: 'app-orgfunctionalmap',
  standalone: true,
  imports: [
    CommonModule,
    NgbCarouselModule,
    NgbAccordionModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxPrintModule,
    SharedModule,
  ],
  templateUrl: './orgfunctionalmap.component.html',
  styleUrl: './orgfunctionalmap.component.scss'
})
export default class OrgfunctionalmapComponent implements OnInit {
  data: any;
  public datafields: Object[];
  public listfields: Object;
  public cssClass: string = "custom";
  staffdata: any;
  viewdata: number;
  orgname: any;
  staffdetails: any;
  cardview = 0;
  hierarchicalData:any;
  flatData= [];
  constructor(public service: OrgfunctionalmapService, public router: Router, public toastr: ToastrService) { }
  ngOnInit() {
    this.getOrgDetails();

  }

  nodeSelect(id: any) {
    this.service.orgid = id;
    this.service.getStaffUnderOrg().subscribe((Response) => {
      let staffchecklog = Response["Response"][0][0]["_logcode"];
      if (staffchecklog == '2190') {
        this.orgname = Response["Response"][2][0]["org_name"];
        if (Response["Response"][1].length == 0) {
          this.toastr.info("No staff available under organization")
          this.viewdata = 0
        } else {
          this.staffdata = Response["Response"][1];
          this.viewdata = 1
          this.cardview = 0;
        }

      }
    });
  }
  flattenData(data: any[], level: number = 0) {
    for (const node of data) {
      this.flatData.push({
        id: node.id,
        name: node.name,
        levelIndicator: '—'.repeat(level)
      });
      if (node.children) {
        this.flattenData(node.children, level + 1);
      }
    }
  }
  getOrgDetails() {
    this.service.getOrgFunctionalMap().subscribe((Response) => {
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2180') {
        this.data = Response["Response"][1];
        const flatData = Response["Response"][2]
        this.hierarchicalData = buildHierarchy(flatData);
        console.log(this.hierarchicalData);
        this.flattenData(this.hierarchicalData);
        // this.treeview();
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        this.router.navigate(['login']);
      }
    });
  }
  treeview() {
    this.removeParentId(this.data);
    this.datafields = this.data;
    console.log(this.datafields);
    this.listfields = { dataSource: this.datafields, id: 'orgid', parentID: 'parentid', text: 'org_name', hasChildren: 'haschild' };
  }

  removeParentId(data) {
    data.forEach(element => {
      if (element["parentid"] == "") {
        delete element["parentid"];
      }
    });
  }
  exportArray() {  //function for exporting the array to the excel organization hierarchy map
    const orgParentArray: Partial<orgparent>[] = this.data.map(x => ({
      OrganizationName: x.org_name,
      ParentName: x.parentname
    }));
    this.exportArrayToExcel(orgParentArray, "Organization Hierarchy");
  }
  exportArrayToExcel(arr: any[], name?: string) { //converting the array to excel for organization functonal map
    let { sheetName, fileName } = getFileName(name);

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  allStaff() {
    this.service.allStaffWithOrg().subscribe((Response) => {
      let allstafflog = Response["Response"][0][0]["_logcode"]
      if (allstafflog == '2200') {
        if (Response["Response"][1].length != 0) {
          this.staffdetails = Response["Response"][1];
          this.cardview = 1;
        } else {
          this.toastr.info("no staff available");
          this.cardview = 0;
        }
      }
    });
  }

  @ViewChild('printsection') content: ElementRef;
  public downloadPDF()     // function for converting div data to pdf 
  {
   let doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [4, 2]
  });
   let specialElementHandlers= {
     '#editor': function(element, renderer){
         return true;
     }
   };
   let content = this.content.nativeElement;
   doc.text(content.innerHTML, 15,15);
   doc.save('Report.pdf');
  }
  
}
export interface orgparent {  //interface for array to excel convertion
  org_name: string;
  parentname: string;
}
const getFileName = (name: string) => {
  let timeSpan = new Date().toISOString();
  let sheetName = name || "ExportResult";
  let fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName
  };
};

function buildHierarchy(data: any[], parentId: number | null = null): any[] {
  return data
    .filter(item => item.parentId === parentId)
    .map(parent => ({
      ...parent,
      children: buildHierarchy(data, parent.id)
    }));
}
