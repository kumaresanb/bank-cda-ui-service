import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelMandateComponent } from './cancel-mandate.component';

describe('CancelMandateComponent', () => {
  let component: CancelMandateComponent;
  let fixture: ComponentFixture<CancelMandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelMandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
