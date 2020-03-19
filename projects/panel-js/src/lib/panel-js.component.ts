import { Component, OnInit, ElementRef, ContentChild } from '@angular/core';
import { PanelJsService } from './panel-js.service';

@Component({
  selector: 'panel-js',
  template: '<ng-content #panelScroll></ng-content>',
  host: {
    "[style.transform]":"'translateY('+pos+'px)'",
    "[style.transition]":"transitionSpeed",
    "[style.backgroundColor]":"transitionSpeed",
    "[style.display]":"'block'"
  },
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  @ContentChild('panelScroll') 
  panelScroll: ElementRef;

  pos: number = 100;
  transitionSpeed: string;
  color: string = "purple;"

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) { }

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
      
      this.color = color;
    });
  }
  ngAfterViewInit() {
    console.log(this.panelScroll)
    console.log(this.elementRef.nativeElement.querySelector("#timesPreventScroll"))
  }
}
