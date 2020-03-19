import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelJsService {

  currentState;
  pos: number = 100;

  positionSubject: Subject<number> = new BehaviorSubject(100);
  currentPos: Observable<number> = this.positionSubject.asObservable();

  touchPosSubject: Subject<number> = new BehaviorSubject(100);
  currentTouchPos: Observable<number> = this.touchPosSubject.asObservable();

  snapPosSubject: Subject<number> = new BehaviorSubject(0);
  currentSnapPos: Observable<number> = this.snapPosSubject.asObservable();

  transitionSpeedSubject: Subject<string> = new BehaviorSubject("0s");
  currentTransitionSpeed: Observable<string>= this.transitionSpeedSubject.asObservable();

  lockSubject: Subject<boolean> = new BehaviorSubject(false);
  currentLock: Observable<boolean> = this.lockSubject.asObservable();

  colourSubject: Subject<string> = new BehaviorSubject("red");
  currentColour: Observable<string> = this.colourSubject.asObservable();

  lock: boolean;

  stage0: number;
  stage1: number;
  stage2: number;
  anchorStage: number;

  diff: number = 0;

  stage0Boundary: number;
  stage1Boundary: number;
  stage2Boundary: number;

  transitionSpeed: string;

  constructor() { }

  init(touchStart: Observable<TouchEvent>, touchMove: Observable<TouchEvent>, touchEnd: Observable<TouchEvent>, touchCancel: Observable<TouchEvent>) {
    const x = window.innerHeight;
    this.stage0 = 0.6 * x;
    this.stage1 = 0;
    this.anchorStage = 0.3 * x;

    this.pos = this.stage0;
    this.positionSubject.next(this.pos);

    this.stage0Boundary = 0.5 * x;
    this.stage1Boundary = 0.3 * x;

    this.transitionSpeed = "0.2s";
    this.transitionSpeedSubject.next(this.transitionSpeed);
    
    this.touchStart(touchStart);
    this.touchMove(touchMove);
    this.touchEnd(touchEnd);
    this.touchCancel(touchCancel);
  }

  

  // Set to position methods

  animateStage0() {
    this.pos = this.stage0;
    this.positionSubject.next(this.pos);
  }
  
  animateStage1() {
    this.pos = this.stage1;
    this.positionSubject.next(this.pos);
  }

  animateAnchorStage() {
    this.pos = this.anchorStage;
    this.positionSubject.next(this.pos);
  }

  // Touch event listeners

  touchStart(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      this.transitionSpeed = "0s";
      this.transitionSpeedSubject.next(this.transitionSpeed);
      this.diff = ev.changedTouches[0].clientY - this.pos;
    });
  }

  touchMove(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      const x = ev.changedTouches[0].clientY;
      this.touchPosSubject.next(x);
      if(x - this.diff <= 0 || x - this.diff >= this.stage0) {
        this.lockSubject.next(true);
      } else {
        this.lockSubject.next(false);
        console.log(x)
        this.pos = x - this.diff;
        this.positionSubject.next(this.pos);
      }
    });
  }

  touchEnd(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      this.transitionSpeed = "0.3s";
      this.transitionSpeedSubject.next(this.transitionSpeed);
      if(this.pos > this.stage0Boundary) {
        this.pos = this.stage0;
        this.positionSubject.next(this.pos);
        this.snapPosSubject.next(0);
        this.colourSubject.next("blue");
      } else {
        this.pos = this.stage1;
        this.positionSubject.next(this.pos);
        this.snapPosSubject.next(1);
        this.colourSubject.next("green");
      }
    });
  }
  touchCancel(event$: Observable<TouchEvent>) {
    event$.subscribe(ev => {
      console.log(ev);
    });
  }
  
  getCurrentPos() { return this.currentPos; }
  getCurrentTransition() { return this.currentTransitionSpeed; }
  getSnapPos() { return this.currentSnapPos; }
  getLock() { return this.currentLock; }
  getTouchPos() { return this.currentTouchPos; }
  getCurrentColour() { return this.currentColour; }
}