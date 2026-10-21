import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginserviceService } from './loginservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,SharedModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  @ViewChild('f') login: NgForm;
  user = {
    phonenumber: '',
    password: ''
  };
  username: any;
  tokenval: any;
  orgval: any;
  privilege: any;
  rolename: any;
  currentUserSignal = signal(null);
  constructor(public router: Router, public service:LoginserviceService,public toastr:ToastrService){

  }
onLogin(){
  // status: "";
    // this.spinner.show();
    this.user.phonenumber = this.login.value.phonenumber;
    this.user.password = this.login.value.password;
    this.service.login(this.user)
      .subscribe((result:Response) => {
        console.log(result)
        status = result["Response"][0][0]["_logcode"];  
        if (status == '3020') {
          this.router.navigate(['admin']);
          // this.spinner.hide();
          //location.reload();
          this.username=result["Response"][2][0]["fullname"];
        
          this.toastr.success("Welcome"+"  "+this.username);             
          this.tokenval=result["Response"][1][0]["tokenval"]; 
          this.orgval=result["Response"][2][0]["orgid"];
          var orgname = result["Response"][2][0]["org_name"]
          var logoshow = result["Response"][2][0]["dashboard"]
          this.privilege=result["Response"][3][0]["privileges"];
          this.service.privilegedata = JSON.parse(this.privilege);
          this.rolename=result["Response"][3][0]["rolename"]; 
           localStorage.setItem('access_token',JSON.stringify(this.tokenval));
           localStorage.setItem('orgid', JSON.stringify(this.orgval));
           localStorage.setItem('privilege', this.privilege);
           localStorage.setItem('rolename', this.rolename);
           localStorage.setItem('username', this.username);
           localStorage.setItem('orgname', orgname);
           localStorage.setItem('logo', logoshow);
           this.service.name= this.username;
          //  let uname= this.service.name
        }
        else if(status == '3021'){
          this.toastr.error("Invalid login details! Please enter a valid one");
          // this.spinner.hide();

        }
      },
        (erro: HttpErrorResponse) => {
          // this.toastr.warning("Can't Able to Connect With Server");
          //   this.spinner.hide();
        });
}
}
