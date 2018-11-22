import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateWorkbenchQueueViewComponent } from './mandate-workbench-queue-view.component';

describe('MandateWorkbenchQueueViewComponent', () => {
  let component: MandateWorkbenchQueueViewComponent;
  let fixture: ComponentFixture<MandateWorkbenchQueueViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateWorkbenchQueueViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateWorkbenchQueueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
