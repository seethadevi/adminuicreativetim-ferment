import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsubComponent } from './productsub.component';

describe('ProductsubComponent', () => {
  let component: ProductsubComponent;
  let fixture: ComponentFixture<ProductsubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
