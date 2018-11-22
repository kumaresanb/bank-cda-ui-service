import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateSubmitPopupComponent } from './mandate-submit-popup.component';

describe('MandateSubmitPopupComponent', () => {
  let component: MandateSubmitPopupComponent;
  let fixture: ComponentFixture<MandateSubmitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateSubmitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
