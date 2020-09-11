'use strict';

(function() {

//  var socket = io.connect('http://192.168.0.17:3000');
var socket = io.connect('wss://socketio-whiteboard-zmx4.herokuapp.com');

  // wss://socketio-whiteboard-zmx4.herokuapp.com/socket.io/?EIO=3&transport=websocket&sid=fxTgFdaMCd-RbKypAAGz
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');

  var current = {
    color: 'black'
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  for (var i = 0; i < colors.length; i++){
  //  alert(1);
    colors[i].addEventListener('click', onColorUpdate, false);
  }

socket.on('drawing', onDrawingEvent);
  // socket.on('draw', function (data) {
  //   console.log("on");

  //  });

  window.addEventListener('resize', onResizeTest, false);

  function onResizeTest() {
    console.log("resize");
  }


  onResize();


  function drawLine(x0, y0, x1, y1, color, emit){
    console.log("emit0");
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    console.log("emit0");

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    console.log("emit1");

    socket.emit('drawing', { line: {x0: x0 / w,y0: y0 / h,x1: x1 / w,y1: y1 / h,color: color} });

    //socket.emit('drawing', {x0: x0 / w,y0: y0 / h,x1: x1 / w,y1: y1 / h,color: color});
    
    console.log("emit2");
  }


  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onColorUpdate(e){
    console.log(current.color)
    if(e.target.className.split(' ')[1] == "clear"){     
     socket.emit('drawing', { action: "clear" });
     onResize();
    }else{
      current.color = e.target.className.split(' ')[1];
    }
    
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(dataX){
    var data = null;
    if (dataX.action) {
      
      onResize();
     // context.clearRect(0, 0, width, height);
    }else if(dataX.line){
      data =  dataX.line;
    console.log(1);
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);

    }

    else {
      

    }
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();
