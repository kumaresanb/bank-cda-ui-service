import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMandateComponent } from './repair-mandate.component';

describe('RepairMandateComponent', () => {
  let component: RepairMandateComponent;
  let fixture: ComponentFixture<RepairMandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairMandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
