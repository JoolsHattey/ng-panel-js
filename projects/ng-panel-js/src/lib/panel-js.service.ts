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

  private events$: Subject<string> = new Subject<string>();

  animateStage0(): void {}
  animateStage1(): void {}
  animateAnchorStage(): void {}

  toggle(): void {
    this.events$.next('toggle');
  }

  getScrollLock() { return this.currentScrollLock$; }
  setScrollLock(newValue: boolean) { this.scrollLockSubject.next(newValue); }

  getSwipeEvents(): Observable<any> {
    return Observable.create(observer => observer.next())
  }

  getConfig(): PanelJSConfig {
    return this.config;
  }

  getEvents(): Observable<string> {
    return this.events$;
  }
}