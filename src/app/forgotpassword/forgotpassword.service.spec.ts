import { TestBed } from '@angular/core/testing';

import { ForgotpasswordService } from './forgotpassword.service';

describe('ForgotpasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForgotpasswordService = TestBed.get(ForgotpasswordService);
    expect(service).toBeTruthy();
  });
});
