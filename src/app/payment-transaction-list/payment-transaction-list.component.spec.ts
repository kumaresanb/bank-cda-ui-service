import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionListComponent } from './payment-transaction-list.component';

describe('PaymentTransactionListComponent', () => {
  let component: PaymentTransactionListComponent;
  let fixture: ComponentFixture<PaymentTransactionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTransactionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
