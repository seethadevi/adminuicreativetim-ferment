// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  prefix: '',
  BASEURL: 'https://api.fermynt.com',
  // BASEURL: 'https://103.3.610.108',
  WEBSTORE: 'https://ws.fermynt.com',
  PRODUCTURL: 'https://gs1.fermynt.com/product',
  DEFAULT_WINE_BOTTLE: 'https://storage.googleapis.com/fermyntstorage/shop-1551249405926.png',
};
