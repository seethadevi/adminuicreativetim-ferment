import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsubFormComponent } from './productsub-form.component';

describe('ProductsubFormComponent', () => {
  let component: ProductsubFormComponent;
  let fixture: ComponentFixture<ProductsubFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsubFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsubFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
