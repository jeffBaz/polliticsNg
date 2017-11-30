import { Position } from './sliders/slider/slider.component';
import { Directive, ElementRef, HostListener, Output, EventEmitter  } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

Observable.fromEvent(document.body, 'mousemove').subscribe(e => {
   // console.log(e);
});

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private mouseDown = false;
  private mouseX = null;
  private mouseY = null;
  private dX = 0;
  private dY = 0;
  private elx = 0;
  private ely = 0;
  private delta: Position;
  @Output() moved: EventEmitter<Position> = new EventEmitter<Position>();
  constructor(private el: ElementRef) { 
    Observable.fromEvent(document.body, 'mousemove').subscribe(e => {
      if (this.mouseX == null || this.mouseY == null){
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
      }
      this.dX = this.mouseX - e.pageX;
      this.dY = this.mouseY - e.pageY;
      this.mouseX = e.pageX;
      this.mouseY = e.pageY;
        console.log("X:" + this.dX +"  Y:" + this.dY + " mouseDown:" + this.mouseDown);
    });
  
  }

  
  
  @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.mouseDown) {
            if (this.elx == null || this.ely == null){
              this.elx = this.el.nativeElement.offsetLeft + document.body.scrollLeft;
              this.ely =  this.el.nativeElement.offsetTop + document.body.scrollTop;
            }
          this.elx = this.elx - this.dX;
          this.ely = this.ely - this.dY;
          this.el.nativeElement.style.position = 'relative';
          this.el.nativeElement.style.left = this.elx + 'px';
          this.el.nativeElement.style.top = this.ely + 'px';
          console.log("top:" + this.el.nativeElement.style.top
              +"  left:" +  this.el.nativeElement.style.left + " mouseDown:" + this.mouseDown);
          this.delta = new Position ( this.dX, this.dY);
          this.moved.emit(this.delta);
        }
    }
  
  getMovement(){
    return this.moved;
  }

    @HostListener('mouseup')
    onMouseup() {
        this.mouseDown = false;
        this.dragStopped();
    }
  
  
    @HostListener('mousedown')
    onMousedown() {
        this.mouseDown = true;
        this.dragStopped();
    }
  
   @HostListener('mouseleave')
    onMouseleave() {
        this.mouseDown = false;
        this.dragStopped();
    }
  dragStopped(){
     this.elx = 0;
     this.ely = 0;
     this.moved.emit(new Position(0, 0, !this.mouseDown));
  }
}

