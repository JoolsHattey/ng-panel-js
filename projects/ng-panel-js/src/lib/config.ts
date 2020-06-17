import { InjectionToken } from '@angular/core';

export interface PanelJSConfig {
  persistent?: boolean;
  stage0?: number;
  stage1?: number;
}

export const LIB_CONFIG = new InjectionToken<PanelJSConfig>('LIB_CONFIG');