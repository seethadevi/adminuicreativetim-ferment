import { TestBed } from '@angular/core/testing';

import { WeezeventService } from './weezevent.service';

describe('WeezeventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeezeventService = TestBed.get(WeezeventService);
    expect(service).toBeTruthy();
  });
});
