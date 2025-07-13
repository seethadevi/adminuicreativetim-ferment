import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopTariffComponent } from './shop-tariff.component';

describe('ShopTariffComponent', () => {
  let component: ShopTariffComponent;
  let fixture: ComponentFixture<ShopTariffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopTariffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
