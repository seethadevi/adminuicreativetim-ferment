import { TestBed } from '@angular/core/testing';

import { BannerPromotionService } from './banner-promotion.service';

describe('BannerPromotionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BannerPromotionService = TestBed.get(BannerPromotionService);
    expect(service).toBeTruthy();
  });
});
