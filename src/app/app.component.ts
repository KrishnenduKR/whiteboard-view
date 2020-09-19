import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as io from '../js/socket.io.js';
import { MousefunctionService } from './services/mousefunction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'board';

  colorArray:any;
  brushClick : boolean = false;
  selectedColor ;
  brushValue:number;

  width = window.innerWidth;
  height = window.innerHeight;
  
  current = {
    color: 'black',
    x: 0,
    y: 0
  };

  drawing = false;
  socket = io.connect('wss://socketio-whiteboard-zmx4.herokuapp.com');

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  
  
  private ctx: CanvasRenderingContext2D;
  constructor( private mouseFnService : MousefunctionService ) {
   // this.setMouseValues()
  }

  ngOnInit(): void {
    this.colorArray = ["black","red", "green","blue","yellow","orange","brown","violet","indigo"];
    
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
    this.brushValue = 5
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.selectedColor = "black";
    //this.canvas.nativeElement.addEventListener('mouseup', this.onMouseUp, false);
    //this.canvas.nativeElement.addEventListener('mouseout', this.onMouseUp, false);
    //this.canvas.nativeElement.addEventListener('mousemove', this.throttle(this.onMouseMove, 10), true);
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
      self.mouseFnService.drawLine(self.ctx,self.current.x, self.current.y, e.clientX, e.clientY, self.selectedColor,self.brushValue)
    };

    this.canvas.nativeElement.onmouseout = function (e) { 
      if (!self.drawing) { return; }
      self.drawing = false;
      self.mouseFnService.drawLine(self.ctx,self.current.x, self.current.y, e.clientX, e.clientY, self.selectedColor,self.brushValue)
    };

    this.canvas.nativeElement.onmousemove = function (e) {
      self.mouseFnService.throttle(self.onMouseMove(e), 10)
       
    };

    //Touch support for mobile devices

    this.canvas.nativeElement.ontouchstart = function (e) { 
      self.drawing = true;
      self.current.x = e.touches[0].clientX;
      self.current.y = e.touches[0].clientY;
    };

  }

  onMouseMove(e){
    if (!this.drawing) { return; }
    this.mouseFnService.drawLine(this.ctx,this.current.x, this.current.y, e.clientX, e.clientY, this.selectedColor,this.brushValue)
    this.current.x = e.clientX;
    this.current.y = e.clientY;
  }

  onBrushClick(){
    this.brushClick = true;
    this.selectedColor = 'black'
  }

  changeColor(color){
    this.selectedColor = color;
  }

  changeBrushValue(e){
     this.brushValue = e.value
  }

  eraser(){
    this.selectedColor = 'white'
  }

  onDrawingEvent(dataX){
    var data = dataX.line;
    var w = this.canvas.nativeElement.width ;
    var h = this.canvas.nativeElement.height;
    this.mouseFnService.drawLine(this.ctx,data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color,data.lineWidth)
    
  }


}
