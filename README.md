# vue-azure-ad-sso

vue.js 项目使用 [OAuth 2.0 Authorization code flow (with PKCE)](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-overview#overview) 集成 Azure AD SSO。

## Project setup

1. 执行 `yarn install` 安装项目依赖
2. 更新 env 文件中的 `VUE_APP_AZURE_CLIENT_ID` 和 `VUE_APP_AZURE_TENANT_ID` 为对应的值

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
