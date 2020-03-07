import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import {createCustomElement} from '@angular/elements';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanelJSComponent } from './panel-js/panel-js.component';
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PanelJSComponent
  ],
  entryComponents: [AppComponent, PanelJSComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [{provide:   APP_BASE_HREF, useValue: '/'}],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    
    const el = createCustomElement(AppComponent, {injector: this.injector});

    customElements.define("my-own-element", el);

    const el2 = createCustomElement(PanelJSComponent, {injector: this.injector});

    customElements.define('panel-js', el2);
  }

    
}
