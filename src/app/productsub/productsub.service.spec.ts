import { TestBed } from '@angular/core/testing';

import { ProductsubService } from './productsub.service';

describe('ProductsubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsubService = TestBed.get(ProductsubService);
    expect(service).toBeTruthy();
  });
});
