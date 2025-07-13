import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailsViewComponent } from './shop-details-view.component';

describe('ShopDetailsViewComponent', () => {
  let component: ShopDetailsViewComponent;
  let fixture: ComponentFixture<ShopDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
