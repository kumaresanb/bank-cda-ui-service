import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateReportComponent } from './mandate-report.component';

describe('MandateReportComponent', () => {
  let component: MandateReportComponent;
  let fixture: ComponentFixture<MandateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
