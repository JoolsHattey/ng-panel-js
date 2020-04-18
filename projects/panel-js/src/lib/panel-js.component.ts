import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { PanelJsService } from './panel-js.service';
import { Observable, fromEvent } from 'rxjs';
import 'rxjs/observable/fromEvent'


@Component({
  selector: 'panel-js',
  template: '<ng-content></ng-content>',
  host: {
    "[style.transform]":"'translateY('+pos+'px)'",
    "[style.transition]":"transitionSpeed",
    "[style.backgroundColor]":"color",
    "[style.display]":"'block'"
  },
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  // ngStyle = "{'transform': 'translateY('pos$ | async')' }"

  private pos: number;
  private transitionSpeed: string = '0';
  private color: string = "purple";

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) {
    this.pos = panelService.getStage0();
  }

  animateIt(pos) {
    this.pos = pos
  }

  ngOnInit() {
    
    const touchStart$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchstart');
    const touchMove$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchmove');
    const touchEnd$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchend');
    const touchCancel$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchcancel');
    const windowResize$: Observable<Event> = fromEvent(window, 'resize');
    
    this.panelService.setWindowSizeListener(windowResize$);
       
    this.panelService.init(touchStart$, touchMove$, touchEnd$, touchCancel$);
    this.panelService.getCurrentPos().subscribe(pos => {
      this.pos = pos
    });
    this.panelService.getCurrentTransition().subscribe(speed => this.transitionSpeed = speed);
    this.panelService.getCurrentColour().subscribe(color => {
      /* Weird ass hacky fix to get it working on Safari, if the bg colour
        isn't the colour passed thru, make it purple, tbh this shouldn't work
        but it does, so dont fuckin break it please */
      if(this.elementRef.nativeElement.style.backgroundColor === color) {
        this.color = "purple";
      } else {
        this.color = color
      }
      
      //this.color = color;
    });
  }
}
