import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { PanelJsService } from './panel-js.service';

@Component({
  selector: 'panel-js',
  template: '<ng-content></ng-content>',
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  private startPos: number;
  private stage0: number;
  private stage1: number;
  private anchorStage: number;
  private stageBoundary: number;
  private currentStage: number;

  private scrollLock = false;

  private persistentMode: boolean;

  private panelOpen: boolean;

  private scrollPos = 0;
  private scrollStartPos: number;

  private scrollActive = false;

  pos: number;
  transitionSpeed = '0s';

  constructor(private panelService: PanelJsService, private elementRef: ElementRef) {
    const config = panelService.getConfig();
    this.stage0 = window.innerHeight * (1 - config.stage0);
    this.stage1 = window.innerHeight * (1 - config.stage1);
    console.log(this.stage1)
    this.anchorStage = window.innerHeight - this.stage0 * 1.5;
    this.persistentMode = config.persistent;

    panelService.getDesktopMode().subscribe(result => this.setDesktopMode(result));

    if (this.persistentMode) {
      this.animateStage0();
      this.panelOpen = true;
    } else {
      this.animateClose();
      this.panelOpen = false;
    }
    this.stageBoundary = this.stage0 / 2;
    this.panelService.getScrollPos().subscribe(pos => {
      this.scrollPos = pos;
    });
  }

  @HostListener('panstart', ['$event']) panstart(event: HammerInput) {
    this.transitionSpeed = '0s';
    this.startPos = event.deltaY - this.pos;
    this.scrollStartPos = this.scrollPos;
  }

  @HostListener('panmove', ['$event']) panmove(event: HammerInput) {
    const touchPos = event.deltaY - this.startPos;
    // Prevent panel from going out of boundaries
    if (this.persistentMode) {
      if (this.currentStage === 2) {
        if (event.offsetDirection === 16) {
          if (this.pos < this.stage0) {
            this.elementRef.nativeElement.animate({
              transform: `translate3d(0, ${touchPos}px, 0)`,
            }, {
              duration: 50,
              fill: 'forwards'
            });
            this.pos = touchPos;
          }
        }
      } else if (touchPos > this.stage1 && touchPos < this.stage0) {
        this.elementRef.nativeElement.animate({
          transform: `translate3d(0, ${touchPos}px, 0)`,
        }, {
          duration: 50,
          fill: 'forwards'
        });
        this.pos = touchPos;
        this.scrollLock = false;
      } else if (touchPos <= this.stage1) {
        if (!this.scrollLock) {
          this.animateStage1();
          this.panelService.setScrollLock(true);
          this.scrollLock = true;
        }
        this.panelService.setScrollPos(this.stage1 - touchPos);
      }
    } else {
      if (touchPos > this.stage1) {
        this.elementRef.nativeElement.animate({
          transform: `translate3d(0, ${touchPos}px, 0)`,
        }, {
          duration: 50,
          fill: 'forwards'
        });
        this.pos = touchPos;
        this.scrollLock = false;
      } else {
        if (!this.scrollLock) {
          this.animateStage1();
          this.panelService.setScrollLock(true);
          this.scrollLock = true;
        }
        this.panelService.setScrollPos(this.stage1 - touchPos);
      }
    }
  }

  @HostListener('panend', ['$event']) panend(event: HammerInput) {
    this.transitionSpeed = '0.3s';
    const speed = Math.abs(event.velocity);
    // Swipe down
    if (event.offsetDirection === 16) {
      if (this.currentStage === 1) {
        if (speed > 0.5 || this.pos > this.stageBoundary) {
          this.animateStage0(true);
        } else {
          this.animateStage1(true);
        }
      } else if (this.currentStage === 2) {
        if (speed > 0.5 || this.pos > this.stageBoundary) {
          this.animateStage0(true);
        } else {
          this.animateStage1(true);
        }
      } else if (this.currentStage === 0 && !this.persistentMode) {
        this.toggle();
      }
    }
    // Swipe up
    else if (event.offsetDirection === 8) {
      if (this.currentStage === 0) {
        if (speed > 0.5 || this.pos < this.stageBoundary) {
          this.animateStage1(true);
        } else {
          this.animateStage0(true);
        }
      }
    }
  }

  setDesktopMode(enable: boolean) {
    enable ? this.elementRef.nativeElement.animate({
      transform: `translate3d(0, ${this.stage1}px, 0)`,
    }, {
      easing: 'ease-out',
      duration: 0,
      fill: 'forwards',
    }) : this.elementRef.nativeElement.animate({
      transform: `translate3d(0, ${this.stage0}px, 0)`,
    }, {
      easing: 'ease-out',
      duration: 0,
      fill: 'forwards',
    });
  }

  animateStage1(swipe?) {
    this.panelService.setScrollLock(true);
    this.scrollLock = true;
    const animation = this.elementRef.nativeElement.animate({
      transform: `translate3d(0, ${this.stage1}px, 0)`,
    }, {
      easing: 'ease-out',
      duration: 300,
      fill: 'forwards'
    });
    if (swipe) {
      animation.finished.then(() => this.panelService.setSwipeEvents('up'));
    }
    this.pos = this.stage1;
    this.currentStage = 1;
  }
  animateStage0(swipe?) {
    this.panelService.setScrollLock(false);
    this.scrollLock = false;
    const animation = this.elementRef.nativeElement.animate({
      transform: `translate3d(0, ${this.stage0}px, 0)`,
    }, {
      easing: 'ease-out',
      duration: 300,
      fill: 'forwards'
    });
    if (swipe) {
      animation.finished.then(() => this.panelService.setSwipeEvents('down'));
    }
    this.pos = this.stage0;
    this.currentStage = 0;
  }
  animateAnchorStage() {
    const animation = this.elementRef.nativeElement.animate([{
      transform: `translate3d(0, ${this.pos}px, 0)`,
    }, {
      transform: `translate3d(0, ${this.anchorStage}px, 0)`,
    }], {
      easing: 'ease-out',
      duration: 300,
      fill: 'forwards'
    });
    this.pos = this.anchorStage;
    this.currentStage = 2;
  }
  animateClose() {
    this.panelService.setScrollLock(false);
    this.scrollLock = false;
    // this.makeAnimation([animate(300, style({transform: `translateY(${window.innerHeight}px)`}))]);
    this.currentStage = -1;
  }

  toggle() {
    this.transitionSpeed = '0.3s';
    if (!this.persistentMode) {
      if (this.panelOpen) {
        this.animateClose();
      } else {
        this.animateStage0();
      }
      this.panelOpen = !this.panelOpen;
    }
  }

  ngOnInit() {
    this.panelService.getEvents().subscribe(event => {
      switch (event) {
        case 'toggle':
          this.toggle();
          break;
        default:
          break;
      }
    });
    this.panelService.getAnchorEvents().subscribe(() => {
      console.log('anchor')
      this.animateAnchorStage();
    });
    console.log(this.panelService.getConfig());
  }
}
