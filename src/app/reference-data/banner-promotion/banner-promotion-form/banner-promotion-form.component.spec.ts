import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPromotionFormComponent } from './banner-promotion-form.component';

describe('BannerPromotionFormComponent', () => {
  let component: BannerPromotionFormComponent;
  let fixture: ComponentFixture<BannerPromotionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerPromotionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerPromotionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
