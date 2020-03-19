import { Component, ElementRef, OnInit } from '@angular/core';
import { PanelJsService } from './panel-js.service';
import { Observable, fromEvent } from 'rxjs';
import 'rxjs/observable/fromEvent'

@Component({
  selector: 'panel-js',
  template: '<ng-content #panelScroll></ng-content>',
  host: {
    "[style.transform]":"'translateY('+pos+'px)'",
    "[style.transition]":"transitionSpeed",
    "[style.backgroundColor]":"color",
    "[style.display]":"'block'"
  },
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  // @ContentChild('panelScroll') 
  // panelScroll: ElementRef;

  pos: number = 100;
  transitionSpeed: string;
  color: string = "purple";

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) { }

  ngOnInit() {
    let touchStart$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchstart')
    let touchMove$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchmove')
    let touchEnd$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchend')
    let touchCancel$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchcancel')

    this.panelService.init(touchStart$, touchMove$, touchEnd$, touchCancel$);
    this.panelService.getCurrentPos().subscribe(pos => {this.pos = pos; console.log(pos)});
    this.panelService.getCurrentTransition().subscribe(speed => this.transitionSpeed = speed);
    this.panelService.getCurrentColour().subscribe(color => {
      /* Weird ass hacky fix to get it working on Safari, if the bg colour
        isn't the colour passed thru, make it purple, tbh this shouldn't work
        but it does, so dont fuckin break it please */
      if(this.elementRef.nativeElement.style.backgroundColor == color) {
        this.color = "purple";
      } else {
        this.color = color
      }
      
      this.color = color;
    });
    //this.panelService.snapPosObs.subscribe(snap => console.log(snap));
    // console.log(this.elementRef);
    // console.log(this.panelScroll)
    // console.log(this.elementRef.nativeElement.querySelector("#timesPreventScroll"))
  }
}
