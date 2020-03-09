import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { PanelJsComponent } from './panel-js.component';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';


export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'swipe': {velocity: 0.4, threshold: 20} // override default settings
  }
}

@NgModule({
  declarations: [PanelJsComponent],
  imports: [
  ],
  entryComponents: [PanelJsComponent],
  exports: [PanelJsComponent],
  providers:    [ { 
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig 
  } ]
})
export class PanelJsModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ngElement = createCustomElement(PanelJsComponent, {injector: this.injector});

    customElements.define('panel-js', ngElement);
  }
}
