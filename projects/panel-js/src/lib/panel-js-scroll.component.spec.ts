import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelJsScrollComponent } from './panel-js-scroll.component';

describe('PanelJsScrollComponent', () => {
  let component: PanelJsScrollComponent;
  let fixture: ComponentFixture<PanelJsScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelJsScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelJsScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
