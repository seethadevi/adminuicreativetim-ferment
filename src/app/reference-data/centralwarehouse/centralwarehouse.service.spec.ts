import { TestBed } from '@angular/core/testing';

import { CentralwarehouseService } from './centralwarehouse.service';

describe('CentralwarehouseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentralwarehouseService = TestBed.get(CentralwarehouseService);
    expect(service).toBeTruthy();
  });
});
