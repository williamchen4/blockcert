// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    appName: 'FS Blockcert App',
    URL_API: 'https://qn03ofc83f.execute-api.us-west-2.amazonaws.com/default',
    URL_LOGIN: 'https://blockcert.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=163ceh9222tloco93e04qlulh7&redirect_uri=https://qn03ofc83f.execute-api.us-west-2.amazonaws.com/default/redirect&state=STATE&scope=openid+profile+aws.cognito.signin.user.admin',
    URL_LOGOUT: 'https://blockcert.auth.us-west-2.amazoncognito.com/logout?response_type=code&client_id=163ceh9222tloco93e04qlulh7&redirect_uri=https://qn03ofc83f.execute-api.us-west-2.amazonaws.com/default/redirect&state=STATE&%20scope=openid+profile+aws.cognito.signin.user.admin'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
