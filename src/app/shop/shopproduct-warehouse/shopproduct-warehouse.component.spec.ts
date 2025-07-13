import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopproductWarehouseComponent } from './shopproduct-warehouse.component';

describe('ShopproductWarehouseComponent', () => {
  let component: ShopproductWarehouseComponent;
  let fixture: ComponentFixture<ShopproductWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopproductWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopproductWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
