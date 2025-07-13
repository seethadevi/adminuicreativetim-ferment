import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopproductAddrecommendationsComponent } from './shopproduct-addrecommendations.component';

describe('ShopproductAddrecommendationsComponent', () => {
  let component: ShopproductAddrecommendationsComponent;
  let fixture: ComponentFixture<ShopproductAddrecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopproductAddrecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopproductAddrecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
