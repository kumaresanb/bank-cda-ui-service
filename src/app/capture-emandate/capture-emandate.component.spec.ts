import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureEmandateComponent } from './capture-emandate.component';

describe('CaptureEmandateComponent', () => {
  let component: CaptureEmandateComponent;
  let fixture: ComponentFixture<CaptureEmandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaptureEmandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureEmandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
