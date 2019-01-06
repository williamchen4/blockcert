export const environment = {
    production: true,
    appName: 'FS Blockcert App',
    URL_API: 'https://qn03ofc83f.execute-api.us-west-2.amazonaws.com/default',
    URL_LOGIN: 'https://blockcert.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=163ceh9222tloco93e04qlulh7&redirect_uri=https://qn03ofc83f.execute-api.us-west-2.amazonaws.com/default/redirect&state=STATE&scope=openid+profile+aws.cognito.signin.user.admin',
    URL_LOGOUT: 'https://blockcert.auth.us-west-2.amazoncognito.com/logout?response_type=code&client_id=163ceh9222tloco93e04qlulh7&redirect_uri=https://qn03ofc83f.execute-api.us-west-2.amazonaws.com/default/redirect&state=STATE&%20scope=openid+profile+aws.cognito.signin.user.admin'
};
