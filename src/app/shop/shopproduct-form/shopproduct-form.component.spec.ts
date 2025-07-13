import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopproductFormComponent } from './shopproduct-form.component';

describe('ShopproductFormComponent', () => {
  let component: ShopproductFormComponent;
  let fixture: ComponentFixture<ShopproductFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopproductFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopproductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
