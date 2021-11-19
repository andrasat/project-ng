// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  // QS API
  apiQS: vars.QS_API, // 'https://dev7.esb.co.id/api-ezo-dev'
  bearerQS: vars.QS_BEARER, // 'zmxncbv1029384756'
  usernameQS: vars.QS_USERNAME, // 'ESBADMIN'
  passwordQS: vars.QS_PASS, // '14ecdbacbc51885a09c4d0592e685898'
  // OTHER
  mapboxToken: vars.MAPBOX_TOKEN,
  firebase: vars.FIREBASE,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
