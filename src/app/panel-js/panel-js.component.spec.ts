import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelJSComponent } from './panel-js.component';

describe('PanelJSComponent', () => {
  let component: PanelJSComponent;
  let fixture: ComponentFixture<PanelJSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelJSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelJSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
