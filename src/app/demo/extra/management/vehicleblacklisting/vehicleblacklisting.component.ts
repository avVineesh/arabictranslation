
import { CommonModule} from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { VehicleblacklistingService } from './vehicleblacklisting.service';
@Component({
  selector: 'app-vehicleblacklisting',
  standalone: true,
  imports: [
      CommonModule,
      NgbCarouselModule,
      FormsModule,
      NgxSpinnerModule,
      RouterModule,
      SharedModule,
  ],
  templateUrl: './vehicleblacklisting.component.html',
  styleUrl: './vehicleblacklisting.component.scss'
})
export default class VehicleblacklistingComponent implements OnInit {

  vehicledata: any;
  constructor(public service: VehicleblacklistingService,public toaster: ToastrService, public router: Router,
      public spinner:NgxSpinnerService,public modalService: NgbModal) { }
      ngOnInit() {
      this.resetform();
      this.getBLVehicleDetails();
      }

      addVehicle(add: ElementRef) {
        this.modalService.open(add, { size: 'md' });
      }

      resetform(form?: NgForm) {
        if (form != null)
          form.resetForm();
       this.service.vehicledata={
         token : "",
         vehiclenumber: "",
         vehicletype: "",
       }
      }

      getBLVehicleDetails(){
        this.spinner.show();
        this.service.getblvehicleDetails().subscribe((Response)=>{
          let logcode = Response["Response"][0][0]["_logcode"];
          if(logcode=='3120'){
            if(Response["Response"][1].length!=0){
              this.vehicledata = Response["Response"][1];
              this.datatable();
              this.spinner.hide();
            }else {
              this.toaster.info("No Blacklisted Vehicles!");
              this.spinner.hide();
             //this.datatable();
            }
          } else{
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

      datatable() { // function for coverting in to data table
        $('#mytable').DataTable().destroy();
        $(document).ready(function () {
          var table = $('#mytable').DataTable({
            "ordering": false,
          });
          table.draw();
        });
      }

      saveVehicleDetails(){ //fnction for savin individual tag deetails .....................................
        this.service.saveVehicleDetails(this.service.vehicledata).subscribe((Response)=>{
          let logcode = Response["Response"][0][0]["_logcode"];
            if (logcode == '3012') {
              this.toaster.success("Saved Successfully");
              this.resetform();
              this.getBLVehicleDetails();
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

}
