import { NgModule, Injector } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { createCustomElement } from '@angular/elements';
import { PanelJsComponent } from './panel-js.component';



@NgModule({
  declarations: [PanelJsComponent],
  imports: [
    //RouterModule.forRoot({"": PanelJsModule})
  ],
  entryComponents: [PanelJsComponent],
  exports: [PanelJsComponent]
})
export class PanelJsModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ngElement = createCustomElement(PanelJsComponent, {injector: this.injector});

    customElements.define('panel-js', ngElement);
  }
}
