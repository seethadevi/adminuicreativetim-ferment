import { ApplogoutModule } from './applogout.module';

describe('ApplogoutModule', () => {
  let applogoutModule: ApplogoutModule;

  beforeEach(() => {
    applogoutModule = new ApplogoutModule();
  });

  it('should create an instance', () => {
    expect(applogoutModule).toBeTruthy();
  });
});
