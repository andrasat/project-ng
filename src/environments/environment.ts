// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // QS API
  transID: '58280eb4ca0e7ef22b08814b8016006666626132353733313636393137666231626130383536623130386237633666336336353935666239396133353066366564353364633734653631383861343431637a3f774720a5b0bd49d588bd6635035ab606841bd2d92e8959a79bc0c880e89a01bfe154c6ff5085f36de922f11512',
  apiQS: 'https://stg7.esb.co.id/api-ezo-int',
  devApiQS: 'https://dev7.esb.co.id/api-ezo-dev',
  bearerQS: 'cjNPJgQJrdtlP3qgnO5f6qZ7lZML9n2XkoynmVPqSB1QseIxwImTDGBEVQPJ',
  devBearerQS: 'zmxncbv1029384756',
  usernameQS: 'ESBADMIN',
  passwordQS: '14ecdbacbc51885a09c4d0592e685898',
  visitPurposeID: 'aA%3D%3D',
  // OTHER
  mapboxToken: 'pk.eyJ1IjoiYW5kcmFzYXQiLCJhIjoiY2t1d2JvMzUyMjllODJvczdtbnBub2RqcyJ9.DZdpSQCcqxoopSpQcaZIpw',
  firebase: {
    apiKey: "AIzaSyCCgy-zg2xmHtux7dPv_1L8_v26eeIedtU",
    authDomain: "esb-order-ng.firebaseapp.com",
    projectId: "esb-order-ng",
    storageBucket: "esb-order-ng.appspot.com",
    messagingSenderId: "703837333144",
    appId: "1:703837333144:web:fa0f3458a08e827dfe52ed"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
