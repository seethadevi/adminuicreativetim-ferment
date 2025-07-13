import { TestBed, inject } from '@angular/core/testing';

import { WineryService } from './winery.service';

describe('WineryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WineryService]
    });
  });

  it('should be created', inject([WineryService], (service: WineryService) => {
    expect(service).toBeTruthy();
  }));
});
