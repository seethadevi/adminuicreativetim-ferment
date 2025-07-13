import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopproductRevertWarehouseComponent } from './shopproduct-revert-warehouse.component';

describe('ShopproductRevertWarehouseComponent', () => {
  let component: ShopproductRevertWarehouseComponent;
  let fixture: ComponentFixture<ShopproductRevertWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopproductRevertWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopproductRevertWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
