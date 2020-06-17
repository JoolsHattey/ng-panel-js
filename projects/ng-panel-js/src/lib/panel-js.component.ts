import { Component, OnInit, HostListener } from '@angular/core';
import { PanelJsService } from './panel-js.service';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'panel-js',
  template: '<ng-content></ng-content>',
  host: {
    "[style.transform]":"'translate3d(0, '+pos+'px, 0)'",
    "[style.transition]":"transitionSpeed",
    "[style.backgroundColor]":"colour",
    "[style.display]":"'block'",
    "[style.willChange]": "'transform'"
  },
  styleUrls: ['./panel-js.component.scss']
})
export class PanelJsComponent implements OnInit {

  private startPos: number;
  private stage0: number = window.innerHeight / 2;
  private stage1: number = 0;
  private stageBoundary: number = this.stage0 / 2;
  private currentStage: number = -1;

  private persistentMode: boolean;

  private panelOpen: boolean;
  
  pos: number;
  transitionSpeed: string = '0s';

  // Used to fix iOS propogation bug
  colour: string = "purple";
  private colourSubject: Subject<string> = new BehaviorSubject("red");

  constructor(private panelService: PanelJsService) {
    const config = panelService.getConfig();
    this.persistentMode = config.persistent;
    if (this.persistentMode) {
      this.pos = this.stage0;
      this.panelOpen = true;
    } else {
      this.pos = window.innerHeight;
      this.panelOpen = false;
    }
  }

  @HostListener('panstart', ['$event']) panstart(event: HammerInput) {
    event.preventDefault();
    this.transitionSpeed = '0s';
    this.startPos = event.deltaY - this.pos;
  }

  @HostListener('panmove', ['$event']) panmove(event: HammerInput) {
    const touchPos = event.deltaY - this.startPos;
    // Prevent panel from going out of boundaries
    if (touchPos > 0 && touchPos < this.stage0) {
      this.pos = touchPos;
    }
  }

  @HostListener('panend', ['$event']) panend(event: HammerInput) {
    this.transitionSpeed = '0.3s';
    const speed = Math.abs(event.velocity);
    console.log(event);
    // Swipe down
    if (event.offsetDirection === 16) {
      if (this.currentStage === 1) {
        if (speed > 0.5 || this.pos > this.stageBoundary) {
          this.animateStage0();
        } else {
          this.animateStage1();
        }
      }
    }
    // Swipe up
    else if (event.offsetDirection === 8) {
      if (this.currentStage === 0) {
        if (speed > 0.5 || this.pos < this.stageBoundary) {
          this.animateStage1();
        } else {
          this.animateStage0();
        }
      }
    }
  }

  animateStage1() {
    this.panelService.setScrollLock(true);
    this.pos = this.stage1;
    this.currentStage = 1;
    this.colourSubject.next('green');
  }
  animateStage0() {
    this.panelService.setScrollLock(false);
    this.pos = this.stage0;
    this.currentStage = 0;
    this.colourSubject.next('blue');
  }
  animateClose() {
    this.panelService.setScrollLock(false);
    this.pos = window.innerHeight;
    this.currentStage = -1;
    this.colourSubject.next('yellow');
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
    console.log(this.panelService.getConfig());
    this.colourSubject.asObservable().subscribe(color => {
      if(this.colour === color) {
        this.colour = "purple";
      } else {
        this.colour = color
      }
    });
  }
}
