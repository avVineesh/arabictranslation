import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NgbCarouselModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CameraplotService } from './cameraplot.service';
@Component({
  selector: 'app-cameraplot',
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
  templateUrl: './cameraplot.component.html',
  styleUrl: './cameraplot.component.scss'
})
export default class CameraplotComponent implements OnInit {
  @ViewChild('mycanvas') canvasRef: ElementRef;
  isDrawing = false;
  canDraw: boolean = false;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
// private rects= { x: number; y: number; width: number; height: number; lotname: any; lotid: any }
 showimg: number;
 imageurl: any;
 number = 1;
 camdetarray = [];
 lots: any;
 plots: any;
 enablemouseclick: boolean = true;
  mouseupnum =1;
  mousedownnum =1;
  mousemovenum =1;
  plottype: any;
  constructor(public service: CameraplotService, public toaster: ToastrService,
    public spinner: NgxSpinnerService, public router: Router) { }
  ngOnInit() {
    this.getCamImage();
    this.resetform();
  }
  resetform(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.plotmodal = {
      token: "",
      camid: "",
      coordinates: ""
    }
  }
  getPlotType(event:any){
    this.plottype=event.target.value;
    this.getCamImage();
    
  }
  getCamImage() { // function for gettingg image against camera.........................
    this.service.camid = JSON.parse(localStorage.getItem('camid'));
    this.spinner.show();
    this.service.getCamImage().subscribe((Response) => {
      let entryimglog = Response["Response"][0][0]["_logcode"];
      if (entryimglog == '2840') {
        this.lots = Response["Response"][2];
        if (Response["Response"][1][0]["imgurl"] != null) {
          this.showimg = 1;
          this.imageurl = JSON.parse(Response["Response"][1][0]["imgurl"]);
          this.drawImageonCanvas();

          if (Response["Response"][3][0]["plot"] != null) {
            this.plots = JSON.parse(Response["Response"][3][0]["plot"]);
            this.enablemouseclick = false;
            setTimeout(() => {
              for (var j = 0; j < this.plots.length; j++) {
                if(this.plottype=='box'){
                  this.drawRect(this.plots[j]["x"], this.plots[j]["y"], this.plots[j]['lotname'],this.plots[j]['width'],this.plots[j]['height']);
                } else if(this.plottype=='line'){
                   this.drawCoordinates(this.plots[j]["x"], this.plots[j]["y"], this.plots[j]["height"], this.plots[j]["width"], this.plots[j]["lotname"]);
                }else{
                  this.toaster.info("Please select a plot type!")
                }


              }
            }, 5000);
            //  this.testarray.push(this.plots[j]["x"]);
            //  this.testarray.push(this.plots[j]["y"]);
          } else {
            this.toaster.info("Coordinates not plotted");
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.showimg = 0;
          this.toaster.info("Image Not Found!");
        }

      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        localStorage.removeItem("camid");
        this.router.navigate(['login']);
        this.spinner.hide();
      }
    });
    this.spinner.hide();
  }
  mouseClick(e: any) { //Mouse click event for getting coordinates
    if (this.enablemouseclick) {
      var campoints = {
        lotname: "",
        lotid: "",
        x: 0,
        y: 0
      };
      if ((this.number - 1) < this.lots.length) {
       // var bnds = e.target.getBoundingClientRect();
        //var x = e.clientX - bnds.left;
       // var y = e.clientY - bnds.top;
       // this.drawCoordinates(x, y, this.lots[this.number - 1]["parkingnumber"]);
        campoints.lotname = this.lots[this.number - 1]["parkingnumber"];
        campoints.lotid = this.lots[this.number - 1]["parkingid"];
       // campoints.x = x;
       // campoints.y = y;
       // this.camdetarray.push(campoints);
    
        this.number++;
      } else {
        this.toaster.info("All slots marked!");
      }
    }




  }

 drawRect(x, y, lot,w,h) { // function for plotting coordinates on image rectangle 
    const pointSize = 10; // Change according to the size of the point.
    const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ff2626"; // Red color
    ctx.beginPath(); //Start path
    // ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.strokeStyle = "#FF2626";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, h);
    ctx.fill(); // Close the path and fill.
    ctx.font = "40px Georgia";  // font style 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = '#ff00a6'; // font color
    ctx.fillText(lot, x + (w / 2), y + (h / 2));
  }
  saveCoordinates() { //function for saving the coordinates..............................
    this.spinner.show();
    this.service.plotmodal.camid = this.service.camid;
    this.service.plotmodal.coordinates = JSON.stringify(this.camdetarray);
  
    this.service.saveCameraCoordinates().subscribe((Response) => {
     
      let logcode = Response["Response"][0][0]["_logcode"];
      if (logcode == '2850') {
        this.toaster.success("Coordinates Saved Successfully");
        this.spinner.hide();
      } else {
        this.toaster.error("Token Expired");
        localStorage.removeItem("access_token");
        localStorage.removeItem("orgid");
        localStorage.removeItem("Role");
        localStorage.removeItem("privilege");
        localStorage.removeItem("camid");
        this.router.navigate(['login']);
        this.spinner.hide();
      }
    });
  }
  clearCanvas() { // function for clearing the  canvas for redrawing ........................................
    this.enablemouseclick = true;
    this.canDraw= true;
    this.number = 1;
    this.camdetarray = [];
    this.drawImageonCanvas();
  }
  drawImageonCanvas() {
    const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var myImg = new Image();
    myImg.src = this.imageurl;
    myImg.onload = function () {
      canvas.height = myImg.height;
      canvas.width = myImg.width;
      ctx.drawImage(myImg, 0, 0);
    };
  }

  // all under these are for drawing rectangles in the loaded image for tetsing purpose
  onMouseDownrect(event: MouseEvent) {
    if((this.number - 1) < this.lots.length){  // condition for checking whether allslots are marked or not 
      if (this.canDraw) {
        this.isDrawing = true;
      }
        this.startX = event.clientX - this.canvasRef.nativeElement.getBoundingClientRect().left;
         this.startY = event.clientY - this.canvasRef.nativeElement.getBoundingClientRect().top;
    }
    
    
  
  }
  onMouseMoverect(event: MouseEvent) {
    const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
    const ctx = canvas.getContext('2d');
    if (this.isDrawing && this.canDraw) {
        this.currentX = event.clientX - this.canvasRef.nativeElement.getBoundingClientRect().left;
        this.currentY = event.clientY - this.canvasRef.nativeElement.getBoundingClientRect().top;
  
       
  
        // Draw rectangles
        const width = this.currentX - this.startX;
        const height = this.currentY - this.startY;
        // const height = Math.floor (width*1.2);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.startX, this.startY, width, height);
      
     
    }
  }
  onMouseUprect(event: MouseEvent) {
    if(this.isDrawing){
    const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
    const ctx = canvas.getContext('2d');
    this.isDrawing = false;
      const width = this.currentX - this.startX;
      // const height = Math.floor(width * 1.2); 
      const height = this.currentY - this.startY;
     
   // ctx.fillText('Lot Num', this.startX + (width / 2), this.startY + (height / 2));
    if ((this.number-1) < this.lots.length) {   // condition to block the drawing if all the slots are marked 
     const lotname = this.lots[this.number - 1]["parkingnumber"];
      const lotid = this.lots[this.number - 1]["parkingid"];
      //this.rects.push({ x: this.startX, y: this.startY,  width, height,lotname,lotid});
      var rect = {
        x: 0, y: 0, width: 0, height: 0, lotname: "", lotid: ""
      }
      rect.x=this.startX;
      rect.y= this.startY;
      rect.width = width;
      rect.height = height;
      rect.lotname = lotname;
      rect.lotid = lotid;
      this.camdetarray.push(rect);
      // Fill rectangles
      ctx.fillStyle = 'black';
      ctx.fillRect(this.startX, this.startY, width, height);
      ctx.fill();
      ctx.font = "40px Georgia";  // font style 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = '#ff00a6'; // font color
      ctx.fillText(this.lots[this.number - 1]["parkingnumber"], this.startX + (width / 2), this.startY + (height / 2));
       this.number++;
     
     } 
  }else {
    this.toaster.info("All slots marked!");
    this.canDraw = false;
   
  }
  }


  drawCoordinates(x: number, y: number, height: number, width: number, lot: string) {
    const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(height, width);
    ctx.strokeStyle = "#FF2626";
    ctx.lineWidth = 4;
    ctx.stroke();
  
    // Midpoint
    const midX = (x + height) / 2;
    const midY = (y + width) / 2;
  
    // Draw lot name at center
    ctx.font = "40px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ff00a6";
    ctx.fillText(lot, midX, midY);
  }
  onMouseUp(event: MouseEvent) {
    if (this.isDrawing) {
      const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
      const ctx = canvas.getContext('2d');
      this.isDrawing = false;
  
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;
      if ((this.number - 1) < this.lots.length) {
        const lotname = this.lots[this.number - 1]["parkingnumber"];
        const lotid = this.lots[this.number - 1]["parkingid"];
  
        const line = {
          x: this.startX,
          y: this.startY,
          height: endX,
          width: endY,
          lotname,
          lotid
        };
  
        this.camdetarray.push(line);
  
        // Draw the final line
        this.drawCoordinates(this.startX, this.startY, endX, endY, lotname);
  
        this.number++;
      } else {
        this.toaster.info("All slots marked!");
        this.canDraw = false;
      }
    }
  }
  onMouseMove(event: MouseEvent) {
    if (this.isDrawing && this.canDraw) {
      const canvas = <HTMLCanvasElement>document.getElementById('mycanvas');
      const ctx = canvas.getContext('2d');
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
  
      this.currentX = event.clientX - rect.left;
      this.currentY = event.clientY - rect.top;
  
     
  
      // Redraw previously saved lines
      this.camdetarray.forEach(l => {
        this.drawCoordinates(l.x, l.y, l.height, l.width, l.lotname);
      });
  
      // Draw preview line
      ctx.beginPath();
      ctx.moveTo(this.startX, this.startY);
      ctx.lineTo(this.currentX, this.currentY);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  onMouseDown(event: MouseEvent) {
    if ((this.number - 1) < this.lots.length) {
      if (this.canDraw) {
        this.isDrawing = true;
        const rect = this.canvasRef.nativeElement.getBoundingClientRect();
        this.startX = event.clientX - rect.left;
        this.startY = event.clientY - rect.top;
      }
    }else{
      this.toaster.info("All slots Marked")
    }
  }
        
}
