import { Component, OnInit, ElementRef, ViewChild, ContentChild } from '@angular/core';
import { PanelJsService } from './panel-js.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'panel-js',
  template: '<ng-content #panelScroll></ng-content>',
  host: {
    "[style.transform]":"'translateY('+pos+'px)'",
    "[style.transition]":"transitionSpeed", 
    "[style.display]":"'block'"
  },
  animations: [
    state('stage2', style({
      transition: 'translateY(0)'
    })),
    state('stage1', style({
      transition: `translateY(${window.innerHeight*0.5})`
    })),
    state('stage0', style({
      transition: `translateY('+pos+'px)`
    })),
  ],
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  @ContentChild('panelScroll', { static: false }) 
  panelScroll: ElementRef;

  pos: number = 100;
  transitionSpeed: string;

  constructor(private panelService: PanelJsService, private elementRef: ElementRef, private hamme: hammer) { }

  ngOnInit() {
    console.log(this.panelScroll)
    console.log(this.elementRef.nativeElement.querySelector("#timesPreventScroll"))
    this.panelService.init(this.elementRef.nativeElement, this.elementRef.nativeElement.querySelector("#timesPreventScroll"));
    this.panelService.getCurrentPos().subscribe(pos => this.pos = pos);
    this.panelService.getCurrentTransition().subscribe(speed => this.transitionSpeed = speed);
    this.panelService.getCurrentColour().subscribe(color => {
      /* Weird ass hacky fix to get it working on Safari, if the bg colour
        isn't the colour passed thru, make it purple, tbh this shouldn't work
        but it does, so dont fuckin break it please */
      if(this.elementRef.nativeElement.style.backgroundColor == color) {
        this.elementRef.nativeElement.style.backgroundColor = "purple";
      } else {
        this.elementRef.nativeElement.style.backgroundColor = color
      }
    });
  }
  ngAfterViewInit() {
    console.log(this.panelScroll)
    console.log(this.elementRef.nativeElement.querySelector("#timesPreventScroll"))
  }
}
