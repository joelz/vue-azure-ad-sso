export default {
  loginRequest: {
    scopes: ["openid", "profile", "User.Read"]
  },
  /**
   * 这个选项是用来控制浏览器从登录页到Azure AD登录页时使用跳转还是弹窗。
   * 参考这里：https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-sign-in?tabs=javascript2#choosing-between-a-pop-up-or-redirect-experience
   */
  useRedirect: process.env.VUE_APP_AZURE_USE_REDIRECT,
  /**
   * Configuration Options完整文档在这里：https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
   */
  config: {
    auth: {
      clientId: process.env.VUE_APP_AZURE_CLIENT_ID,
      authority: 'https://login.microsoftonline.com/' + process.env.VUE_APP_AZURE_TENANT_ID,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  }
}
