import { VendorsubModule } from './vendorsub.module';

describe('VendorsubModule', () => {
  let vendorsubModule: VendorsubModule;

  beforeEach(() => {
    vendorsubModule = new VendorsubModule();
  });

  it('should create an instance', () => {
    expect(vendorsubModule).toBeTruthy();
  });
});
