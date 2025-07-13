import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPromotionListComponent } from './banner-promotion-list.component';

describe('BannerPromotionListComponent', () => {
  let component: BannerPromotionListComponent;
  let fixture: ComponentFixture<BannerPromotionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerPromotionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerPromotionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
