import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateUploadedGridComponent } from './mandate-uploaded-grid.component';

describe('MandateUploadedGridComponent', () => {
  let component: MandateUploadedGridComponent;
  let fixture: ComponentFixture<MandateUploadedGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateUploadedGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateUploadedGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
