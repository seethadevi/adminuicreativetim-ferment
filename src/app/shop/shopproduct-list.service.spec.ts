import { TestBed } from '@angular/core/testing';

import { ShopproductListService } from './shopproduct-list.service';

describe('ShopproductListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopproductListService = TestBed.get(ShopproductListService);
    expect(service).toBeTruthy();
  });
});
