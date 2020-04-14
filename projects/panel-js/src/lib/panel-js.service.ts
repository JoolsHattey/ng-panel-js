import { Injectable, HostListener } from '@angular/core';
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

  private stageBoundary: number;
  private stage1Boundary: number;

  private touchStartTime: number = 0;

  private transitionSpeed: string;

  private startPos: number;

  private anchorLock: boolean = false;

  private scrollFocus: boolean = false;
  private scrollPosition: number = 0;

  constructor() {}

  /**
   * Runs when the window is size is changed
   * Updates the stages and stage boundary
   * @param $windowSize 
   */
  setWindowSizeListener($windowSize: Observable<Event>) {
    $windowSize.subscribe(ev => {
      const x = window.innerHeight;
      this.stage0 = 0.5 * x;
      this.stage1 = 0;
      this.anchorStage = 0.3 * x;
      this.stageBoundary = this.stage0/2;
      if(this.currentState===0) {
        this.animateStage0();
      } else {
        this.animateStage1();
      }
    });
  }

  /**
   * Initialises the service with the event observable streams
   * @param touchStartEvent 
   * @param touchMoveEvent 
   * @param touchEndEvent 
   * @param touchCancelEvent 
   */
  init(
      touchStartEvent: Observable<TouchEvent>, touchMoveEvent: Observable<TouchEvent>, 
      touchEndEvent: Observable<TouchEvent>, touchCancelEvent: Observable<TouchEvent>
    ) {
    this.pos = this.stage0;
    this.positionSubject.next(this.pos);

    const x = window.innerHeight;
    this.stage0 = 0.5 * x;
    this.stage1 = 0;
    this.anchorStage = 0.3 * x;
    this.stageBoundary = this.stage0/2;

    this.transitionSpeed = "0s";
    this.transitionSpeedSubject.next(this.transitionSpeed);

    this.touchStart(touchStartEvent);
    this.touchMove(touchMoveEvent);
    this.touchEnd(touchEndEvent);
    this.touchCancel(touchCancelEvent); 

    this.animateStage0();
  }

  /**
   * Listen to scroll position and lock the panel if the scroll is not at top
   * @param scrollPos 
   */
  setScrollListener(scrollPos: Observable<any>) {
    scrollPos.subscribe(pos => {
      if(this.scrollFocus) {

      } else {
        this.scrollPosition = pos.target.scrollTop;
        this.scrollFocus = true;
      }
      
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
    this.anchorLock = false;
    this.lockSubject.next(false);
    this.pos = this.stage0;
    this.positionSubject.next(this.pos);
    this.currentState = 0;
    this.snapPosSubject.next(0);
    this.colourSubject.next("blue");
  }
  
  animateStage1() {
    this.anchorLock = false;
    this.lockSubject.next(true);
    this.pos = this.stage1;
    this.positionSubject.next(this.pos);
    this.currentState = 1;
    this.snapPosSubject.next(1);
    this.colourSubject.next("green");
  }

  animateAnchorStage() {
    this.anchorLock = true;
    this.pos = this.anchorStage;
    this.positionSubject.next(this.pos);
    this.snapPosSubject.next(2);
    this.colourSubject.next("yellow");
  }

  // Touch event listeners

  /**
   * Runs when the touch event begins
   * Gets the timestamp for speed calculations
   * @param event$ 
   */
  touchStart(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      this.touchStartTime = ev.timeStamp;
      this.startPos = ev.changedTouches[0].clientY;
      this.transitionSpeed = "0s";
      this.transitionSpeedSubject.next(this.transitionSpeed);
      this.diff = ev.changedTouches[0].clientY - this.pos;
      ev.composedPath().some(data => {
        // if(data === document.querySelector('panel-js-scroll')) {
        //   this.scrollFocus = true;
        // } else {
        //   this.scrollFocus = false;
        //   //this.scrollFocus = false;
        // }
      })
    });
  }

  /**
   * 
   * @param event$ 
   */
  touchMove(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      const x = ev.changedTouches[0].clientY;
      this.touchPosSubject.next(x - this.diff);

      // Animate to the top if the touch point as at top
      if(x - this.diff <= 0) {
        if(!this.anchorLock) {
          this.animateStage1();
          console.log("yiss")
        }
        
      }
      // Check the panel is within the screen so it can't go off page
      else if(!(x - this.diff <= 0 || x - this.diff >= this.stage0)) {
        if(!this.lock) {
          this.pos = x - this.diff;
          this.positionSubject.next(this.pos);
        }
      }
    });
  }

  /**
   * 
   * @param event$ 
   */
  touchEnd(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {

      this.scrollFocus = false;

      // Set transition speed 
      this.transitionSpeed = "0.3s";
      this.transitionSpeedSubject.next(this.transitionSpeed);
      
      // Get the speed of the swipe
      const time = ev.timeStamp - this.touchStartTime;
      const diff = this.startPos - ev.changedTouches[0].clientY;
      let direction: string;
      if(diff >= 0) {
        direction = "up";
      } else {
        direction = "down";
      }
      const distance = Math.abs(diff);
      const speed = distance / time;

      if(!(distance <= 0 || this.pos >= this.stage0)) {

        // Check if panel is anchored
        if(this.anchorLock) {
          if(this.pos > this.stageBoundary) {
            // Swipe down
            this.animateStage0()
          } else {
            // Swiping up doesn't lock and drops back to anchor stage
            this.animateAnchorStage();
          } 
        } else {
          // Detect swipe if speed is fast enough
          if(speed > 0.6) {
            if(direction === "up") {
              this.animateStage1();
            } else {
              this.animateStage0();
            }
          } else {
            // If swipe is not detected, animate to the closest stage
            if(this.pos < this.stageBoundary) {
              this.animateStage1();
            } else {
              this.animateStage0();
            }
          }
        }
      }
    });
  }

  /**
   * 
   * @param event$ 
   */
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