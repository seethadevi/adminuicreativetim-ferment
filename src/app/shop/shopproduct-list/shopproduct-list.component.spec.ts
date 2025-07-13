import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopproductListComponent } from './shopproduct-list.component';

describe('ShopproductListComponent', () => {
  let component: ShopproductListComponent;
  let fixture: ComponentFixture<ShopproductListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopproductListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopproductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
