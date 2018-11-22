import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateWorkbenchComponent } from './mandate-workbench.component';

describe('MandateWorkbenchComponent', () => {
  let component: MandateWorkbenchComponent;
  let fixture: ComponentFixture<MandateWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
