# PanelJS

Swipe card module written in Angular.
This components replicates the material design bottom sheet component.

## Using in Angular

1. Install PanelJS and HammerJS

```
npm i paneljs hammerjs
```

2. Import the module into the main app module

```
...
import { PanelJsModule, PanelJsService } from 'panel-js';


@NgModule({
  ...,
  imports: [
    ...,
    PanelJsModule,
  ],
  providers: [
    ...,
    PanelJsService
  ]
})
export class AppModule {  }

```

## Native Web component - coming soon