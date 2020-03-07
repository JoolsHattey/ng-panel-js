import { Component, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { PanelJSComponent } from './panel-js/panel-js.component';

@Component({
  selector: 'my-own-element',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'elements-demo';
}
