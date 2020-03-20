import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { PanelJsComponent } from './panel-js.component';
import { PanelJsScrollComponent } from './panel-js-scroll.component';

@NgModule({
  declarations: [PanelJsComponent, PanelJsScrollComponent],
  imports: [],
  entryComponents: [PanelJsComponent, PanelJsScrollComponent],
  exports: [PanelJsComponent, PanelJsScrollComponent],
})
export class PanelJsModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const panel = <any> createCustomElement(PanelJsComponent, {injector: this.injector});
    const panelScroll = <any> createCustomElement(PanelJsScrollComponent, {injector: this.injector});

    customElements.define('panel-js', panel);
    customElements.define('panel-js-scroll', panelScroll);
  }
}
