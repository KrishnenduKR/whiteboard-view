import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'board';

  colorArray:any;
  brushClick : boolean = false;

  width = window.innerWidth;
  height = window.innerHeight;
  
  current = {
    color: 'black',
    x: 0,
    y: 0
  };

  drawing = false;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  
  
  private ctx: CanvasRenderingContext2D;
  constructor() {
   // this.setMouseValues()
  }

  ngOnInit(): void {
    this.colorArray = ["black","red", "green","blue","yellow","orange","brown","violet","indigo"];
    var socket = io.connect('wss://socketio-whiteboard-zmx4.herokuapp.com');
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
    this.ctx.lineWidth = 5;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    
    //this.canvas.nativeElement.addEventListener('mouseup', this.onMouseUp, false);
    //this.canvas.nativeElement.addEventListener('mouseout', this.onMouseUp, false);
    //this.canvas.nativeElement.addEventListener('mousemove', this.throttle(this.onMouseMove, 10), true);
  
    //this.socket.on('drawing', this.onDrawingEvent);
    //this.onResize();

    this.begin();
  }

 throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  begin(){
    var self = this;
    // Desktop browsers
    this.canvas.nativeElement.onmousedown = function (e) { 
      self.drawing = true;
      self.current.x = e.clientX;
      self.current.y = e.clientY;
    };

    this.canvas.nativeElement.onmouseup = function (e) { 
      if (!self.drawing) { return; }
      self.drawing = false;
      self.drawLine(self.current.x, self.current.y, e.clientX, e.clientY, self.current.color,2);
  
    };

    this.canvas.nativeElement.onmouseout = function (e) { 
      if (!self.drawing) { return; }
      self.drawing = false;
      self.drawLine(self.current.x, self.current.y, e.clientX, e.clientY, self.current.color,2);
    };

    this.canvas.nativeElement.onmousemove = function (e) { 
      self.throttle(self.onMouseMove(e), 10)
    };

    //Touch support for mobile devices

    this.canvas.nativeElement.ontouchstart = function (e) { 
      console.log(self.current);
      self.drawing = true;
      self.current.x = e.touches[0].clientX;
      self.current.y = e.touches[0].clientY;
    };

  }

  onMouseMove(e){
    if (!this.drawing) { return; }
    this.drawLine(this.current.x, this.current.y, e.clientX, e.clientY, this.current.color,2);
    this.current.x = e.clientX;
    this.current.y = e.clientY;
  }

  drawD(data){
    var line = data.line;
    this.ctx.strokeStyle = "#e80914";
    this.ctx.beginPath();
    this.ctx.moveTo(line[0].x, line[0].y);
    this.ctx.lineTo(line[1].x, line[1].y);
    this.ctx.stroke();
    this.ctx.closePath();
    }
    
      
  onBrushClick(){
    this.brushClick = true;
  }





  onDrawingEvent(dataX){
    var data = dataX.line;
    var w = this.canvas.nativeElement.width ;
    var h = this.canvas.nativeElement.height;
    this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color,data.lineWidth);

  }

  drawLine(x0, y0, x1, y1, color,lineWidthLoc){

    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidthLoc;
    
    this.ctx.stroke();
    this.ctx.closePath();
  }


}
