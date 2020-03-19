import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelJsService {



  currentState;
  pos: number = 100;

  posObs = new BehaviorSubject(100);
  currentPos = this.posObs.asObservable();

  touchPosObs = new BehaviorSubject(100);
  currentTouchPos = this.touchPosObs.asObservable();

  snapPosObs = new BehaviorSubject(0);
  currentSnapPos = this.snapPosObs.asObservable();

  transitionSpeedObs = new BehaviorSubject("0s");
  currentTransitionSpeed = this.transitionSpeedObs.asObservable();

  lockObs = new BehaviorSubject(false);
  currentLock = this.lockObs.asObservable();

  colourObs = new BehaviorSubject("red");
  currentColour = this.colourObs.asObservable();

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

  init(el, ns) {
    console.log(ns)
    el.addEventListener('touchstart', evt => this.touchStart(evt), true);
    el.addEventListener('touchmove', evt => this.touchMove(evt), true);
    el.addEventListener('touchend', evt => this.touchEnd(evt), true);
    el.addEventListener('touchcancel', evt => this.touchCancel(evt), true);

    const x = window.innerHeight;
    this.stage0 = 0.6 * x;
    this.stage1 = 0;
    this.anchorStage = 0.3 * x;

    this.pos = this.stage0;
    this.posObs.next(this.pos);

    this.stage0Boundary = 0.5 * x;
    this.stage1Boundary = 0.3 * x;

    this.transitionSpeed = "0.2s";
    this.transitionSpeedObs.next(this.transitionSpeed);
  }

  getCurrentPos() {
    return this.currentPos;
  }

  getCurrentTransition() {
    return this.currentTransitionSpeed;
  }

  getLock() {
    return this.currentLock;
  }

  getTouchPos() {
    return this.currentTouchPos;
  }

  getCurrentColour() {
    return this.currentColour;
  }

  animateStage0() {
    this.pos = this.stage0;
    this.posObs.next(this.pos);
  }
  
  animateStage1() {
    this.pos = this.stage1;
    this.posObs.next(this.pos);
  }

  animateAnchorStage() {
    this.pos = this.anchorStage;
    this.posObs.next(this.pos);
  }

  touchStart(ev) {
    this.transitionSpeed = "0s";
    this.transitionSpeedObs.next(this.transitionSpeed);
    console.log(ev.changedTouches[0].clientY);
    this.diff = ev.changedTouches[0].clientY - this.pos;
  }

  touchMove(ev) {
    const x = ev.touches[0].clientY;
    this.touchPosObs.next(x - this.diff);
    if(x - this.diff <= 0 || x - this.diff >= this.stage0) {
      this.lockObs.next(true);
    } else {
      this.lockObs.next(false);
      this.pos = x - this.diff;
      this.posObs.next(this.pos);
    }
  }

  touchEnd(ev) {
    this.transitionSpeed = "0.3s";
    this.transitionSpeedObs.next(this.transitionSpeed);
    console.log(ev);
    if(this.pos > this.stage0Boundary) {
      this.pos = this.stage0;
      this.posObs.next(this.pos);
      this.snapPosObs.next(0);
      this.colourObs.next("blue");
    } else {
      this.pos = this.stage1;
      this.posObs.next(this.pos);
      this.snapPosObs.next(1);
      this.colourObs.next("green");
    }
  }
  touchCancel(ev) {
    console.log(ev);
  }
}
