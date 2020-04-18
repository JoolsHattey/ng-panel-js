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

  private scrollLockSubject: Subject<boolean> = new BehaviorSubject(false);
  private currentScrollLock$: Observable<boolean> = this.scrollLockSubject.asObservable();

  private colourSubject: Subject<string> = new BehaviorSubject("red");
  private currentColour$: Observable<string> = this.colourSubject.asObservable();

  private swipeEvents: Subject<string> = new Subject<string>();

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
  private scrollFocus2: boolean = false;
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
    const x = window.innerHeight;
    this.stage0 = 0.5 * x;
    this.stage1 = 0;
    this.anchorStage = 0.3 * x;
    this.stageBoundary = this.stage0/2;

    this.animateStage0();

    this.touchStart(touchStartEvent);
    this.touchMove(touchMoveEvent);
    this.touchEnd(touchEndEvent);
    this.touchCancel(touchCancelEvent);
  }

  /**
   * Listen to scroll position and lock the panel if the scroll is not at top
   * @param scrollPos 
   */
  setScrollListener(scrollPos: Observable<any>) {
    scrollPos.subscribe(pos => {
      if(this.scrollFocus2) {

      } else {
        this.scrollPosition = pos.target.scrollTop;
        this.scrollFocus2 = true;
      }
      
      
      if(pos.target.scrollTop > 0) {
        this.lock = true;
        this.lockSubject.next(true);
        this.scrollLockSubject.next(true);
      } else {
        this.lockSubject.next(false);
        this.scrollLockSubject.next(false);
        this.lock = false;
      }
    });
  }

  // Set to position methods

  animateStage0() {
    this.anchorLock = false;
    this.lockSubject.next(false);
    this.scrollLockSubject.next(false);
    this.pos = this.stage0;
    this.positionSubject.next(this.pos);
    this.currentState = 0;
    this.snapPosSubject.next(0);
    this.colourSubject.next("blue");
  }
  
  animateStage1() {
    // this.anchorLock = false;
    this.lockSubject.next(true);
    this.scrollLockSubject.next(true);
    this.pos = this.stage1;
    this.positionSubject.next(this.pos);
    this.currentState = 1;
    this.snapPosSubject.next(1);
    this.colourSubject.next("green");
  }

  animateAnchorStage() {
    this.transitionSpeedSubject.next('0.3s');
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
        console.log(data)
        if(data === document.querySelector('panel-js-scroll')) {
          this.scrollFocus = true;
          return true
        } else {
          this.scrollFocus = false;
        }
      })
    });
  }

  /**
   * 
   * @param event$ 
   */
  touchMove(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      let x = ev.changedTouches[0].clientY;
      if(this.scrollFocus && this.currentState === 1) x -= this.scrollPosition
      this.touchPosSubject.next(x - this.diff);

      // Animate to the top if the touch point as at top
      if(x - this.diff <= 0) {
        
        if(!this.anchorLock) {
          this.animateStage1();

        }
        
      }
      // Check the panel is within the screen so it can't go off page
      else if(!(x - this.diff <= 0 || x - this.diff >= this.stage0)) {
        if(!this.lock || !this.scrollFocus) {
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

      console.log(this.lock, this.scrollFocus)

      if(!(distance <= 0 || this.pos >= this.stage0)) {

        if(!this.lock || !this.scrollFocus) {
          // Check if panel is anchored
          if(this.anchorLock) {
            if(speed > 0.6) {
              if(direction === "up") {
                this.swipeEvents.next('up');
                this.animateStage1()
              } else {
                if(this.pos > this.stageBoundary) {
                  // Swipe down
                  this.animateStage0()
                  this.swipeEvents.next('down');
                } else {
                  // Swiping up doesn't lock and drops back to anchor stage
                  this.animateAnchorStage();
                }
              }
            } else {
              if(this.pos > this.stageBoundary) {
                this.animateStage0();
              } else if(this.pos > this.anchorStage / 2) {
                this.animateAnchorStage();
              } else {
                this.animateStage1();
              }
            }

          } else {
            // Detect swipe if speed is fast enough
            if(speed > 0.6) {
              if(direction === "up") {
                this.swipeEvents.next('up');
                this.animateStage1();
              } else {
                this.swipeEvents.next('down');
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
      }
      this.scrollFocus2 = false;
      this.scrollFocus = false;
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
  getScrollLock() { return this.currentScrollLock$; }
  getTouchPos() { return this.currentTouchPos$; }
  getCurrentColour() { return this.currentColour$; }
  getStage0() { return this.stage0; }
  getSwipeEvents() { return this.swipeEvents; }
}