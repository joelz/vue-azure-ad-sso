<template>
  <div>
    <h2>Login Page</h2>
    <h4>打开开发者工具中的控制台查看更多输出</h4>
    <button @click.prevent="startMsalLogin" :disabled="loading">
      {{ isLogin ? "登录成功" : "SSO 登录" }}
    </button>
    <div v-if="loading">loading...</div>
  </div>
</template>
<script>
import msalConfig from "../config/msal";

export default {
  name: "App",
  data() {
    return {
      loading: false,
      isLogin: false,
    };
  },
  mounted() {
    /**
     * 如果从 login 页面到 Azure AD 登录页时使用跳转方式，当用户在Azure AD登录成功时：
     * 1. 如果 vue-router 使用的是 history 模式：浏览器会跳转回 http://localhost:8080/login#code=xxxxx，
     *    从code的值中可用解析出Azure AD的token
     *
     * 2. 如果 vue-router 使用的是 hash 模式：浏览器跳转回的地址会是 http://localhost:8080/#/code=xxxxx，
     *    这时就应该把这段解析 code 的代码移动到 App.vue 的 mounted() 中。
     */
    if (msalConfig.useRedirect) {
      const code = document.location.href.split("#").pop();
      if (code && (code.indexOf("code=") === 0 || code.indexOf("code=") === 1)) {
        console.log(
          "AAD_SSO",
          "Find auth code in path, starting handleRedirectPromise..."
        );
        this.loading = true;
        this.$msalInstance
          .handleRedirectPromise()
          .then((resp) => {
            console.log(
              "AAD_SSO",
              "handleRedirectPromise on mounted done",
              resp
            );
            // 得到 Azure AD 的 token 后，调用下面的 systemLogin
            this.systemLogin(resp.accessToken);
          })
          .catch((err) => {
            console.error(err);
            this.loading = false;
          });
      }
    }
  },
  methods: {
    async startMsalLogin() {
      // 静默登录
      // const myAccounts = this.$msalInstance.getAllAccounts();
      // console.log('myAccounts:', myAccounts);
      // this.getMsalAccessToken(myAccounts[0]);

      // 交互式登录
      this.getMsalAccessTokenViaInteractiveMode();
    },
    // 交互模式登录：弹窗或者跳转到Azure AD登录页面，完成登录，获取到Azure AD的token
    async getMsalAccessTokenViaInteractiveMode() {
      this.loading = true;

      // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md
      const request = {
        scopes: ["User.Read"],
        prompt: "select_account",
      };

      console.info("Using interactive mode to msal get access token...");
      if (msalConfig.useRedirect) {
        this.$msalInstance.acquireTokenRedirect(request);
      } else {
        let tokenResponse = await this.$msalInstance.acquireTokenPopup(request);
        console.log(
          `Access token acquired via interactive auth ${tokenResponse.accessToken}`
        );
        this.systemLogin(tokenResponse.accessToken);
      }
    },
    // 静默登录，成功则调用下面的 systemLogin
    // 失败则调用 getMsalAccessTokenViaInteractiveMode
    async getMsalAccessToken(account) {
      const request = {
        scopes: ["User.Read"],
        account,
      };

      try {
        let tokenResponse = await this.$msalInstance.acquireTokenSilent(
          request
        );
        console.log("setAccessToken", tokenResponse.accessToken);

        this.systemLogin(tokenResponse.accessToken);
      } catch (error) {
        console.error(error);
        console.error(
          "Silent token acquisition failed. Using interactive mode"
        );
        if (msalConfig.useRedirect) {
          this.$msalInstance.acquireTokenRedirect(request);
        } else {
          let tokenResponse = await this.$msalInstance.acquireTokenPopup(
            request
          );
          console.log(
            `Access token acquired via interactive auth ${tokenResponse.accessToken}`
          );
          this.systemLogin(tokenResponse.accessToken);
        }
      }
    },
    // 调用业务系统后端服务，用 Azure AD 的 token（即下文中的 msalAccessToken）去获取业务系统的 token。
    // 建议流程：
    // 1. 前端传递 msalAccessToken 给后端
    // 2. 后端服务在接收到 msalAccessToken 后，
    //    curl -i https://graph.microsoft.com/v1.0/me -H "Authorization: Bearer {msalAccessToken}"
    //    得到类似如下响应:
    //   {
    //     "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity",
    //     "businessPhones": [
    //         "(86) 86-755-111111"
    //     ],
    //     "displayName": "Bo,Joe Doe",
    //     "givenName": "Bo, Joe",
    //     "jobTitle": "Engineer, IT Software Development",
    //     "mail": "xxx@kpltest.onmicrosoft.com",
    //     "mobilePhone": null,
    //     "officeLocation": "xxxxx",
    //     "preferredLanguage": "en-US",
    //     "surname": "Doe",
    //     "userPrincipalName": "Joe.B.Doe@kpltest.onmicrosoft.com",
    //     "id": "e5ef4925-1259-4e69-aca3-c4f4d5c81f61"
    //   }
    // 3. 用响应中的 userPrincipalName 去匹配业务系统中的用户标识，匹配成功后返回 token 给前端
    // 4. 前端接收 token，继续后续操作
    //
    // 注意：大陆地区访问 https://graph.microsoft.com/v1.0/me 可能会有超时的情况发生
    systemLogin(msalAccessToken) {
      // 调用业务系统后端服务，用 msalAccessToken 去获取业务系统的 token。
      console.log("systemLogin:", msalAccessToken);
      this.isLogin = true;
      this.loading = false;
    },
  },
};
</script>
<style>
</style>
