import { ProductsubModule } from './productsub.module';

describe('ProductsubModule', () => {
  let productsubModule: ProductsubModule;

  beforeEach(() => {
    productsubModule = new ProductsubModule();
  });

  it('should create an instance', () => {
    expect(productsubModule).toBeTruthy();
  });
});
