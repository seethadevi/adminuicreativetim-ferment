import { TestBed } from '@angular/core/testing';

import { ShopTariffService } from './shop-tariff.service';

describe('ShopTariffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopTariffService = TestBed.get(ShopTariffService);
    expect(service).toBeTruthy();
  });
});
