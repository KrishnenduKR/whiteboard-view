
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
  // drawing = false;
  // current = {
  //   color: 'black',
  //   x: 10,
  //   y: 10
  // };
  width = window.innerWidth;
  height = window.innerHeight;
  mouse = {
    click: false,
    move: false,
    pos: {
      x: 0,
      y: 0
    },
    pos_prev: {
      x: 0,
      y:0
    }
  };

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  
  
  private ctx: CanvasRenderingContext2D;
  constructor() {
    this.setMouseValues()
  }
  //socket = io('wss://socketio-whiteboard-zmx4.herokuapp.com');  
  //paper = document.getElementsByClassName('canvasstyle')[0];
  //colors = document.getElementsByClassName('menu');

  ngOnInit(): void {
    this.colorArray = ["black","red", "green","blue","yellow","orange","brown","violet","indigo"];
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = this.width;
    this.canvas.nativeElement.height = this.height;
    this.ctx.lineWidth = 5;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    
    //this.canvas.nativeElement.addEventListener('mousedown', this.onMouseDown, false);
    //this.canvas.nativeElement.addEventListener('mouseup', this.onMouseUp, false);
    //this.canvas.nativeElement.addEventListener('mouseout', this.onMouseUp, false);
    //this.canvas.nativeElement.addEventListener('mousemove', this.throttle(this.onMouseMove, 10), true);
  
    //this.socket.on('drawing', this.onDrawingEvent);
    //this.onResize();
    this.begin();
  }

  setMouseValues(){
    this.mouse.click = false
    this.mouse.move = false
    this.mouse.pos.x = 0
    this.mouse.pos.y = 0
    this.mouse.pos_prev.x = 0
    this.mouse.pos_prev.y = 0
  }

  begin(){
    this.loop()
    var self = this;
    this.canvas.nativeElement.onmousedown = function (e) { 
       self.mouse.click = true;
    };

    this.canvas.nativeElement.onmouseup = function (e) { 
      self.mouse.click = false; 
    };
      
    this.canvas.nativeElement.onmousemove = function (e) {
      var rect = self.canvas.nativeElement.getBoundingClientRect(); 
        self.mouse.pos.x = e.clientX - rect.left,
        self.mouse.pos.y = e.clientY - rect.top;
        self.mouse.move = true;

      };
      this.loop()
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
    
    loop() {
      if (this.mouse.click && this.mouse.move && this.mouse.pos_prev) {
        this.drawD({ line: [this.mouse.pos, this.mouse.pos_prev] })
        this.mouse.move = false;
      }
      this.mouse.pos_prev = { x: this.mouse.pos.x, y: this.mouse.pos.y };
      setTimeout(() => this.loop(), 400);
    }
      
  onBrushClick(){
    this.brushClick = true;
  }

  // onDrawingEvent(dataX){
  //   var data = null;
  //   console.log('datax',dataX)
  //   if (dataX.action) {
      
  //     this.onResize();
  //    // context.clearRect(0, 0, width, height);
  //   }else if(dataX.line){
  //     data =  dataX.line;
  //   console.log(1);
  //   var w = this.canvas.nativeElement.width;
  //   var h = this.canvas.nativeElement.height;
  //   this.drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color,true);

  //   }
  // }

  // onResize() {
  //   this.canvas.nativeElement.width = window.innerWidth;
  //   this.canvas.nativeElement.height = window.innerHeight;
  // }

  // drawLine(x0, y0, x1, y1, color, emit){
  //   console.log("emit0");
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(x0, y0);
  //   this.ctx.lineTo(x1, y1);
  //   this.ctx.strokeStyle = color;
  //   this.ctx.lineWidth = 2;
  //   this.ctx.stroke();
  //   this.ctx.closePath();

  //   console.log("emit0");

  //   if (!emit) { return; }
  //   var w = this.canvas.nativeElement.width;
  //   var h = this.canvas.nativeElement.height;

  //   console.log("emit1");

  //   this.socket.emit('drawing', { line: {x0: x0 / w,y0: y0 / h,x1: x1 / w,y1: y1 / h,color: color} });

  //   //socket.emit('drawing', {x0: x0 / w,y0: y0 / h,x1: x1 / w,y1: y1 / h,color: color});
    
  //   console.log("emit2");
  // }

  // onMouseDown(e){
  //   this.drawing = true;
  //   this.current.x = e.clientX||e.touches[0].clientX;
  //   this.current.y = e.clientY||e.touches[0].clientY;
  // }

  // onMouseUp(e){
  //   if (!this.drawing) { return; }
  //   this.drawing = false;
  //   this.drawLine(this.current.x, this.current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, this.current.color, true);
  // }

  // onMouseMove(e){
  //   if (!this.drawing) { return; }
  //   this.drawLine(this.current.x, this.current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, this.current.color, true);
  //   this.current.x = e.clientX||e.touches[0].clientX;
  //   this.current.y = e.clientY||e.touches[0].clientY;
  // }

  // throttle(callback, delay) {
  //   var previousCall = new Date().getTime();
  //   return function() {
  //     var time = new Date().getTime();

  //     if ((time - previousCall) >= delay) {
  //       previousCall = time;
  //       callback.apply(null, arguments);
  //     }
  //   };
  // }
}
