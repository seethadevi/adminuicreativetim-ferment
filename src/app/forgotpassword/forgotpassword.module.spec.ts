import { ForgotpasswordModule } from './forgotpassword.module';

describe('ForgotpasswordModule', () => {
  let forgotpasswordModule: ForgotpasswordModule;

  beforeEach(() => {
    forgotpasswordModule = new ForgotpasswordModule();
  });

  it('should create an instance', () => {
    expect(forgotpasswordModule).toBeTruthy();
  });
});
