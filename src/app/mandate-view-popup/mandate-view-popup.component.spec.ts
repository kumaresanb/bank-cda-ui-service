import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateViewPopupComponent } from './mandate-view-popup.component';

describe('MandateViewPopupComponent', () => {
  let component: MandateViewPopupComponent;
  let fixture: ComponentFixture<MandateViewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateViewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
