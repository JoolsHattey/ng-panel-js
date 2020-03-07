import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './panel-js.component.html',
  styleUrls: ['./panel-js.component.scss'],
  // host: {
  //   '[style.height.px]':'pos'
  // },
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.5,
        backgroundColor: 'green'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('0.5s')
      ]),
      transition('open <=> closed', [
        animate('0.5s')
      ]),
      transition ('* => open', [
        animate ('1s',
          style ({ opacity: '*' }),
        ),
      ]),
      transition('* => *', [
        animate('1s')
      ]),
    ])
  ]
})
export class PanelJSComponent implements OnInit {

  pos;

  constructor() { }

  ngOnInit() {
    addEventListener('click', evt => this.toggle(), true);
    addEventListener('touchstart', this.touchStart, true);
    addEventListener('touchmove', this.touchMove, true)
    addEventListener('touchend', this.touchMove, true)
    addEventListener('touchcancel', this.touchMove, true)
  }

  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  // @HostListener('touchstart') doThing() {
  //   console.log("yiss")
  // }

  touchStart(ev) {
    console.log(ev.changedTouches[0].clientY);
    //this.toggle()
  }
  touchMove(ev) {
    this.pos = ev.touches[0].clientY;
    console.log(this.pos);
    //this.toggle()
  }
  touchEnd(ev) {
    console.log(ev);
  }
  touchCancel(ev) {
    console.log(ev);
  }



}
