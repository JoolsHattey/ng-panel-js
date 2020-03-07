import { Component, OnInit, ElementRef } from '@angular/core';
//import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'panel-js',
  template: '<ng-content></ng-content>',
  host: {
    "[style.transform]":"'translateY('+pos+')'",
    "[style.display]":"'block'"
  }
})
export class PanelJsComponent implements OnInit {

  //pos = new BehaviorSubject<number>(20);
  currentState;
  pos = "100px";

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.elementRef.nativeElement.addEventListener('touchstart', evt => this.touchStart(evt), true);
    this.elementRef.nativeElement.addEventListener('touchmove', evt => this.touchMove(evt), true)
    this.elementRef.nativeElement.addEventListener('touchend', evt => this.touchMove(evt), true)
    this.elementRef.nativeElement.addEventListener('touchcancel', evt => this.touchMove(evt), true)
    // this.pos.subscribe(x => {
    //   this.elementRef.nativeElement.style=`transform: translateY(${x-50}px);`;
    // });
  }



  touchStart(ev) {
    console.log(ev.changedTouches[0].clientY);
    //this.toggle()
  }
  touchMove(ev) {
    const x = ev.touches[0].clientY;
    this.yeet = `${x-50}px`
    //this.elementRef.nativeElement.style=`transform: translateY(${x-50}px);`;
    //this.toggle()
  }
  touchEnd(ev) {
    console.log(ev);
  }
  touchCancel(ev) {
    console.log(ev);
  }

}
