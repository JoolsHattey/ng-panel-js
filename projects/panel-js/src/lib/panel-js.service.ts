import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelJsService {

  private scrollLockSubject: Subject<boolean> = new BehaviorSubject(false);
  private currentScrollLock$: Observable<boolean> = this.scrollLockSubject.asObservable();

  animateStage0(): void {}
  animateStage1(): void {}
  animateAnchorStage(): void {}

  getScrollLock() { return this.currentScrollLock$; }
  setScrollLock(newValue: boolean) { this.scrollLockSubject.next(newValue); }

  getSwipeEvents(): Observable<any> {
    return Observable.create(observer => observer.next())
  }
}