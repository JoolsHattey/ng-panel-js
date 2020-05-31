import { Component, ElementRef, OnInit, Input, HostListener } from '@angular/core';
import { PanelJsService } from './panel-js.service';
import { Observable, fromEvent } from 'rxjs';
import 'rxjs/observable/fromEvent'


@Component({
  selector: 'panel-js',
  template: '<ng-content></ng-content>',
  host: {
    "[style.transform]":"'translate3d(0, '+pos+'px, 0)'",
    "[style.transition]":"transitionSpeed",
    "[style.backgroundColor]":"color",
    "[style.display]":"'block'",
    "[style.willChange]": "'transform'"
  },
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  private pos: number;
  private transitionSpeed: string = '0';
  private color: string = "purple";
  private currentPos: number = 0;
  private startPos;
  private stage0: number = window.innerHeight / 2;
  private stage1: number = 0;

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) {
    this.pos = panelService.getStage0();
  }

  @HostListener('panstart', ['$event']) panstart(event: HammerInput) {
    this.startPos = event.deltaY - this.pos;
  }

  @HostListener('panmove', ['$event']) panmove(event: HammerInput) {
    // console.log(event.center.y)
    console.log(event.deltaY)
    this.pos = event.deltaY - this.startPos;
  }

  @HostListener('panend', ['$event']) panend(event: HammerInput) {
    if (event.velocity > 0.5) {
      if (event.direction === 16) {
        this.animateStage0();
      } else if (event.direction === 8) {
        this.animateStage1();
      }
    } else {
      if (event.direction === 16) {
        this.animateStage0();
      } else if (event.direction === 16) {
        this.animateStage1();
      }
    }
  }

  animateStage1() {
    this.pos = this.stage0;
  }
  animateStage0() {
    this.pos = this.stage0
  }

  ngOnInit() {

    
    // const touchStart$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchstart');
    // const touchMove$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchmove');
    // const touchEnd$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchend');
    // const touchCancel$: Observable<TouchEvent> = fromEvent(this.elementRef.nativeElement, 'touchcancel');
    // const windowResize$: Observable<Event> = fromEvent(window, 'resize');
    
    // this.panelService.setWindowSizeListener(windowResize$);
       
    // this.panelService.init(touchStart$, touchMove$, touchEnd$, touchCancel$);
    // this.panelService.getCurrentPos().subscribe(pos => {
    //   // this.pos = pos
    //   // this.elementRef.nativeElement.style.transform = `translate3d(0, ${pos}px, 0)`
    // });

    // this.panelService.getCurrentTransition().subscribe(speed => this.transitionSpeed = speed);
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
