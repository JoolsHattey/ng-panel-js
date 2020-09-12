# PanelJS

Swipe card module written in Angular.
This components replicates the material design bottom sheet component.

## Using in Angular

1. Install PanelJS and HammerJS

```
npm i ng-panel-js hammerjs
```

2. Import the module into the main app module

```
...
import { PanelJsModule, PanelJsService, PanelJSConfig } from 'panel-js';

const panelJSConfig: PanelJSConfig = {
  stage0: 0.3,
  stage1: 0.8,
  persistent: false,
}

@NgModule({
  ...,
  imports: [
    ...,
    PanelJsModule.forRoot(panelJSConfig),
  ],
  providers: [
    ...,
    PanelJsService
  ]
})
export class AppModule {  }

```

3. Use the component on the page
```
<panel-js>
  <mat-card></mat-card>
</panel-js>
```
The body containing the panel must be set to position fixed
```
body {
  margin: 0;
  width: 100%;
  height: 100%;
  position: fixed;
}
```

If the panel module is configured as persistent it will be displayed on the page and cannot be swipped away.
If the panel is not persistent it will by default not be on the page, you can trigger it with the toggle() method.

## Native Web component - coming soon