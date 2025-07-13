import { TestBed } from '@angular/core/testing';

import { CentralwarehouseproductService } from './centralwarehouseproduct.service';

describe('CentralwarehouseproductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentralwarehouseproductService = TestBed.get(CentralwarehouseproductService);
    expect(service).toBeTruthy();
  });
});
