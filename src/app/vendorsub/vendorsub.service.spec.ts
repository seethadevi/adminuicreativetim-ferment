import { TestBed } from '@angular/core/testing';

import { VendorsubService } from './vendorsub.service';

describe('VendorsubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorsubService = TestBed.get(VendorsubService);
    expect(service).toBeTruthy();
  });
});
