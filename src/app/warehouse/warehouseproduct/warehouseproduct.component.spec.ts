import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseproductComponent } from './warehouseproduct.component';

describe('WarehouseproductComponent', () => {
  let component: WarehouseproductComponent;
  let fixture: ComponentFixture<WarehouseproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
