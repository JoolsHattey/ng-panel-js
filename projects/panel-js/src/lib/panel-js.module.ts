import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { PanelJsComponent } from './panel-js.component';

@NgModule({
  declarations: [PanelJsComponent],
  imports: [
  ],
  entryComponents: [PanelJsComponent],
  exports: [PanelJsComponent],
})
export class PanelJsModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ngElement = <any> createCustomElement(PanelJsComponent, {injector: this.injector});

    customElements.define('panel-js', ngElement);
  }
}
