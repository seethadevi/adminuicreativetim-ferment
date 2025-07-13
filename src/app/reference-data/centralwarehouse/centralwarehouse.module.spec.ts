import { CentralwarehouseModule } from './centralwarehouse.module';

describe('CentralwarehouseModule', () => {
  let centralwarehouseModule: CentralwarehouseModule;

  beforeEach(() => {
    centralwarehouseModule = new CentralwarehouseModule();
  });

  it('should create an instance', () => {
    expect(centralwarehouseModule).toBeTruthy();
  });
});
