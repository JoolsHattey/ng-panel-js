import { TestBed } from '@angular/core/testing';

import { PanelJsService } from './panel-js.service';

describe('PanelJsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PanelJsService = TestBed.get(PanelJsService);
    expect(service).toBeTruthy();
  });
});
