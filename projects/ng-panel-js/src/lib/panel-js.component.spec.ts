import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelJsComponent } from './panel-js.component';

describe('PanelJsComponent', () => {
  let component: PanelJsComponent;
  let fixture: ComponentFixture<PanelJsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelJsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
