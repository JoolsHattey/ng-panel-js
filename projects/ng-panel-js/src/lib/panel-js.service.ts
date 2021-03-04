import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { LIB_CONFIG, PanelJSConfig } from './config';

@Injectable({
  providedIn: 'root'
})
export class PanelJsService {

  constructor(@Inject(LIB_CONFIG) private config: PanelJSConfig) {}

  private scrollLockSubject: Subject<boolean> = new BehaviorSubject(false);
  private currentScrollLock$: Observable<boolean> = this.scrollLockSubject.asObservable();

  private scrollPos$: Subject<number> = new Subject<number>();

  private events$: Subject<string> = new Subject<string>();

  private anchorEvents$: Subject<void> = new Subject<void>();

  private swipeEvents$: Subject<string> = new Subject<string>();

  private desktopMode$: Subject<boolean> = new Subject<boolean>();

  animateStage0(): void {}
  animateStage1(): void {}
  animateAnchorStage(): void {
    this.anchorEvents$.next()
  }

  toggle(): void {
    this.events$.next('toggle');
  }

  getScrollLock() { return this.currentScrollLock$; }
  setScrollLock(newValue: boolean) { this.scrollLockSubject.next(newValue); }

  getSwipeEvents(): Observable<string> { return this.swipeEvents$; }
  setSwipeEvents(ev) { this.swipeEvents$.next(ev); }

  getDesktopMode(): Subject<boolean> { return this.desktopMode$; }
  setDesktopMode(value: boolean): void { this.desktopMode$.next(value); }

  getConfig(): PanelJSConfig { return this.config; }

  getEvents(): Observable<string> { return this.events$; }

  getAnchorEvents(): Observable<void> { return this.anchorEvents$; }

  getScrollPos(): Observable<number> { return this.scrollPos$; }
  setScrollPos(newValue: number): void { this.scrollPos$.next(newValue); }

  // TODO - this temporarily fixed the error, but needs a proper get stage observable
  getStage(): Observable<any> {return new Observable}
}
