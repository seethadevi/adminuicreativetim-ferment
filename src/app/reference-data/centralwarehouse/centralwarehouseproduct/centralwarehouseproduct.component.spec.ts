import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralwarehouseproductComponent } from './centralwarehouseproduct.component';

describe('CentralwarehouseproductComponent', () => {
  let component: CentralwarehouseproductComponent;
  let fixture: ComponentFixture<CentralwarehouseproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralwarehouseproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralwarehouseproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
