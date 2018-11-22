import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMandateComponent } from './view-mandate.component';

describe('ViewMandateComponent', () => {
  let component: ViewMandateComponent;
  let fixture: ComponentFixture<ViewMandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
