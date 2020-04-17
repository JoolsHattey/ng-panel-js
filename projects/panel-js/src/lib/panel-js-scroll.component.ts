import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { PanelJsService } from './panel-js.service';
import { Observable, fromEvent } from 'rxjs';

@Component({
  selector: 'panel-js-scroll',
  template: '<ng-content></ng-content>',
  host: {
    "[style.overflowY]":"overflow",
    "[style.display]":"'block'",
    "[style.transform]":"'translateY('+scrollPos+'px)'"
  },
  styleUrls: ['./panel-js-scroll.component.css']
})
export class PanelJsScrollComponent implements OnInit {

  private overflow: string;
  private scrollPos: number;

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    console.log("panel scroll init")
    const scrollEvent$: Observable<Event> = fromEvent(this.elementRef.nativeElement, 'scroll');
    this.panelService.setScrollListener(scrollEvent$);
    this.panelService.getScrollLock().subscribe(lock => {
      if(lock) {
        this.overflow = "scroll";
      } else {
        this.overflow = "hidden";
      }
      //this.overflow = "scroll";
    });

  }

}
