import { WebcustomerModule } from './webcustomer.module';

describe('WebcustomerModule', () => {
  let webcustomerModule: WebcustomerModule;

  beforeEach(() => {
    webcustomerModule = new WebcustomerModule();
  });

  it('should create an instance', () => {
    expect(webcustomerModule).toBeTruthy();
  });
});
