import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUploadedGridComponent } from './payment-uploaded-grid.component';

describe('PaymentUploadedGridComponent', () => {
  let component: PaymentUploadedGridComponent;
  let fixture: ComponentFixture<PaymentUploadedGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentUploadedGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUploadedGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
