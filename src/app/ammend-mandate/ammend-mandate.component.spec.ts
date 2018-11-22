import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmmendMandateComponent } from './ammend-mandate.component';

describe('AmmendMandateComponent', () => {
  let component: AmmendMandateComponent;
  let fixture: ComponentFixture<AmmendMandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmmendMandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmmendMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
