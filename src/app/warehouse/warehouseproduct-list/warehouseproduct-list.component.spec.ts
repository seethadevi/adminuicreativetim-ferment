import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseproductListComponent } from './warehouseproduct-list.component';

describe('WarehouseproductListComponent', () => {
  let component: WarehouseproductListComponent;
  let fixture: ComponentFixture<WarehouseproductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseproductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseproductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
