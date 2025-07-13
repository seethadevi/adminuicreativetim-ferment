import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsubListComponent } from './productsub-list.component';

describe('ProductsubListComponent', () => {
  let component: ProductsubListComponent;
  let fixture: ComponentFixture<ProductsubListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsubListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
