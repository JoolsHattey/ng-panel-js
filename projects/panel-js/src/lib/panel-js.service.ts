import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelJsService {

  private currentState = 0;
  private pos: number = 100;

  private stateSubject: Subject<number> = new BehaviorSubject(0);
  private currentState$: Observable<number> = this.stateSubject.asObservable();

  private positionSubject: Subject<number> = new BehaviorSubject(100);
  private currentPos$: Observable<number> = this.positionSubject.asObservable();

  private touchPosSubject: Subject<number> = new BehaviorSubject(100);
  private currentTouchPos$: Observable<number> = this.touchPosSubject.asObservable();

  private snapPosSubject: Subject<number> = new BehaviorSubject(0);
  private currentSnapPos$: Observable<number> = this.snapPosSubject.asObservable();

  private transitionSpeedSubject: Subject<string> = new BehaviorSubject("0s");
  private currentTransitionSpeed$: Observable<string>= this.transitionSpeedSubject.asObservable();

  private lockSubject: Subject<boolean> = new BehaviorSubject(false);
  private currentLock$: Observable<boolean> = this.lockSubject.asObservable();

  private colourSubject: Subject<string> = new BehaviorSubject("red");
  private currentColour$: Observable<string> = this.colourSubject.asObservable();

  private lock: boolean;

  private stage0: number;
  private stage1: number;
  private anchorStage: number;

  private diff: number = 0;

  private stage0Boundary: number;
  private stage1Boundary: number;

  private touchStartTime: number = 0;

  private transitionSpeed: string;

  private startPos: number;

  private anchorLock: boolean = false;

  private scrollFocus: boolean = false;

  constructor() { }

  init(
      touchStartEvent: Observable<TouchEvent>, touchMoveEvent: Observable<TouchEvent>, 
      touchEndEvent: Observable<TouchEvent>, touchCancelEvent: Observable<TouchEvent>
    ) {
    const x = window.innerHeight;
    this.stage0 = 0.5 * x;
    this.stage1 = 0;
    this.anchorStage = 0.3 * x;

    this.pos = this.stage0;
    this.positionSubject.next(this.pos);

    this.stage0Boundary = 0.3 * x;
    this.stage1Boundary = 0.4 * x;

    this.transitionSpeed = "0.2s";
    this.transitionSpeedSubject.next(this.transitionSpeed);

    this.touchStart(touchStartEvent);
    this.touchMove(touchMoveEvent);
    this.touchEnd(touchEndEvent);
    this.touchCancel(touchCancelEvent);
  }

  setScrollListener(scrollPos: Observable<any>) {
    scrollPos.subscribe(pos => {
      if(pos.target.scrollTop > 0) {
        this.lock = true;
        this.lockSubject.next(true);
      } else {
        this.lockSubject.next(false);
        this.lock = false;
      }
    });
  }

  // Set to position methods

  animateStage0() {
    this.snapPosSubject.next(0);
    this.colourSubject.next("blue");
    this.anchorLock = false;
    this.lockSubject.next(false);
    this.pos = this.stage0;
    this.positionSubject.next(this.pos);
    this.currentState = 0;
  }
  
  animateStage1() {
    this.snapPosSubject.next(1);
    this.colourSubject.next("green");
    this.anchorLock = false;
    this.lockSubject.next(true);
    this.pos = this.stage1;
    this.positionSubject.next(this.pos);
    this.currentState = 1;
  }

  animateAnchorStage() {
    this.snapPosSubject.next(2);
    this.colourSubject.next("yellow");
    this.anchorLock = true;
    this.pos = this.anchorStage;
    this.positionSubject.next(this.pos);
    
  }

  // Touch event listeners

  touchStart(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      this.touchStartTime = ev.timeStamp;
      this.startPos = ev.changedTouches[0].clientY;
      this.transitionSpeed = "0s";
      this.transitionSpeedSubject.next(this.transitionSpeed);
      this.diff = ev.changedTouches[0].clientY - this.pos;
      ev.composedPath().some(data => {
        if(data === document.querySelector('panel-js-scroll')) {
          this.scrollFocus = true;
        } else {
          this.scrollFocus = false;
          //this.scrollFocus = false;
        }
      })
    });
  }

  touchMove(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      const x = ev.changedTouches[0].clientY;
      this.touchPosSubject.next(x - this.diff);

      // Animate to the top if the touch point as at top
      if(x - this.diff <= 0) {
        this.animateStage1();
        console.log("yiss")
      }
      // Check the panel is within the screen so it can't go off page
      else if(!(x - this.diff <= 0 || x - this.diff >= this.stage0)) {
        if(!this.lock) {
          this.pos = x - this.diff;
          this.positionSubject.next(this.pos);
          
        }
        console.log(this.scrollFocus)
      }
      // ev.preventDefault();
    });
  }

  touchEnd(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      // Set transition speed 
      this.transitionSpeed = "0.3s";
      this.transitionSpeedSubject.next(this.transitionSpeed);
      
      // Get the speed of the swipe
      const time = ev.timeStamp - this.touchStartTime
      const distance = Math.abs(this.startPos - ev.changedTouches[0].clientY);
      const speed = distance / time;

      if(!(this.pos === 0 || this.pos >= this.stage0)) {

        // Check if panel is anchored
        if(this.anchorLock) {
          if(this.pos > this.stage0Boundary) {
            // Swipe down
            this.animateStage0()
          } else {
            // Swiping up doesn't lock and drops back to anchor stage
            this.animateAnchorStage();
          } 
        } else {

          // Detect swipe if speed is fast enough
          if(speed > 0.6) {
            if(this.currentState === 0) {
              this.animateStage1();
            } else {
              this.animateStage0();
            }
          } else {
            if(this.currentState === 0) {
              this.animateStage0();
            } else {
              this.animateStage1();
            }
          }  
        }
      }
    });
  }

  touchCancel(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      console.log(ev);
    });
  }
  
  getCurrentPos() { return this.currentPos$; }
  getCurrentTransition() { return this.currentTransitionSpeed$; }
  getSnapPos() { return this.currentSnapPos$; }
  getLock() { return this.currentLock$; }
  getTouchPos() { return this.currentTouchPos$; }
  getCurrentColour() { return this.currentColour$; }
  getStage0() { return this.stage0; }
}