import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralwarehouseComponent } from './centralwarehouse.component';

describe('CentralwarehouseComponent', () => {
  let component: CentralwarehouseComponent;
  let fixture: ComponentFixture<CentralwarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralwarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralwarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
