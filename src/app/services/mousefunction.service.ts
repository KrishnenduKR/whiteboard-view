import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MousefunctionService {

  constructor() { }

  drawLine(ctx, x0, y0, x1, y1, color,lineWidthLoc){

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidthLoc;
    
    ctx.stroke();
    ctx.closePath();
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


}
