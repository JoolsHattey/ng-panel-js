import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { PanelJsService } from './panel-js.service';

@Component({
  selector: 'panel-js-scroll',
  template: '<ng-content></ng-content>',
  styleUrls: ['./panel-js-scroll.component.css']
})
export class PanelJsScrollComponent implements OnInit {

  overflow: string;

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) { }

  @HostListener('pan', ['$event']) pan(event: Event) {
    console.log('scroll');
  }

  @HostListener('scroll', ['$event'])  onScroll(event: Event) {
    console.log('scroll');
  }

  ngOnInit(): void {
    this.panelService.getScrollLock().subscribe(lock => {
      if (lock) {
        this.overflow = 'scroll';
      } else {
        this.overflow = 'hidden';
      }
    });
    this.panelService.getScrollPos().subscribe(pos => {
      this.elementRef.nativeElement.scrollTo(0, pos);
    });
  }
}
