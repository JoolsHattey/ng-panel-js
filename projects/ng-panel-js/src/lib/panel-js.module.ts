import { NgModule, Injector, Injectable, ModuleWithProviders } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { PanelJsComponent } from './panel-js.component';
import { PanelJsScrollComponent } from './panel-js-scroll.component';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { PanelJSConfig, LIB_CONFIG } from './config';

@Injectable() export class PanelHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pan': {threshold: 0}
  }
}

@NgModule({
  declarations: [PanelJsComponent, PanelJsScrollComponent],
  imports: [HammerModule],
  entryComponents: [PanelJsComponent, PanelJsScrollComponent],
  exports: [PanelJsComponent, PanelJsScrollComponent],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: PanelHammerConfig
  }]
})
export class PanelJsModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const panel = <any> createCustomElement(PanelJsComponent, {injector: this.injector});
    const panelScroll = <any> createCustomElement(PanelJsScrollComponent, {injector: this.injector});

    customElements.define('panel-js', panel);
    customElements.define('panel-js-scroll', panelScroll);
  }

  static forRoot(config: PanelJSConfig): ModuleWithProviders<PanelJsModule> {
    return({
      ngModule: PanelJsModule,
      providers: [
        {
          provide: LIB_CONFIG,
          useValue: config
        }
      ]
    })
  }
}

