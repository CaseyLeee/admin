<template>
  <div class="login-container">
    <div class="container_left">
      <!-- <img :src="loginimg_2" alt="" /> -->
      <span>Face Manage 管理后台</span>
      
      <img :src="loginimg_1" alt="" />
    </div>
    <div class="container_right">
      <div>
        <span>密码登录</span>
        <el-input
          ref="username"
          v-model="loginForm.userAccount"
          placeholder="请输入您的账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        ></el-input>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.passWordori"
          :type="passwordType"
          placeholder="请输入您的密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        ></el-input>
        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
        <span>忘记密码请联系服务商</span>
      </div>
    </div>
    <!-- <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.userAccount"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.passWordori"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>   
    </el-form> -->
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      loginimg_1: require("../../assets/img/login_1.png"),
      loginimg_2: require("../../assets/img/login_2.png"),
      loginForm: {
        userAccount: "",
        passWord: "",
        msUserType: 2,
        passWordori: "",
      },

      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations(["setAgencyInfo"]),
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.passWord.focus();
      });
    },
    handleLogin() {
        
      this.loading = true;
      this.loginForm.passWord = this.$md5(this.loginForm.passWordori);
      this.loginForm.passWordori=""
      let loginres = {};
      this.$store
        .dispatch("user/login", this.$qs.stringify(this.loginForm))
        .then((data) => {
          loginres = data;

          window.localStorage.setItem(process.env.VUE_APP_TOKEN, data.token);
          this.$router.push({ path: this.redirect || "/" });
          this.loading = false;
         
          return this.$store.dispatch(
            "user/getInfo",
            this.$qs.stringify({ token: loginres.token })
          );
        })
        .then((res) => {
          if (res && res.token) {
            let userInfo = Object.assign({}, loginres, {
              agencyType: "2", //DIF
              extraToken: res.token,
              companyId: res.companyId,
              propertyId: res.propertyId,
            }); //DIF

            this["setAgencyInfo"](userInfo);
          } else {
            this.$Message.error(this.$t("login.loginError"));
            window.localStorage.setItem(process.env.VUE_APP_TOKEN, "");
            this.setAgencyInfo("");
          }
        })
        .catch((msg) => {
          this.loading = false;
          this.$Message.error(msg);
        });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

// $bg: #283443;
// $light_gray: #fff;
// $cursor: #fff;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }

// /* reset element-ui css */
// .login-container {
//   .el-input {
//     display: inline-block;
//     height: 47px;
//     width: 85%;

//     input {
//       background: transparent;
//       border: 0px;
//       -webkit-appearance: none;
//       border-radius: 0px;
//       padding: 12px 5px 12px 15px;
//       color: $light_gray;
//       height: 47px;
//       caret-color: $cursor;

//       &:-webkit-autofill {
//         box-shadow: 0 0 0px 1000px $bg inset !important;
//         -webkit-text-fill-color: $cursor !important;
//       }
//     }
//   }

//   .el-form-item {
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     background: rgba(0, 0, 0, 0.1);
//     border-radius: 5px;
//     color: #454545;
//   }
// }
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  display: flex;
  .container_left {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 45%;
    > span {
      margin-top: 10%;
      width: 395px;
      font-size: 34px;
     	font-weight: bold;
	   
      // object-fit: fill;
   background-image:-webkit-linear-gradient(left,rgba(29, 100, 231,1),rgba(70, 168, 240, 1)); 
	 -webkit-background-clip:text; 
	 -webkit-text-fill-color:transparent;
    }
    > img:nth-child(2) {
      margin-top: 10%;
      width: 764px;
      object-fit: fill;
    }
  }
  .container_right {
    width: 55%;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      background: #ffffff;
      box-shadow: 0px 7px 23px 2px #e0e0e9;
      width: 50%;
      height: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > span:nth-child(1) {
        width: 65%;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #5c6258;
      }
      > span {
        &:last-child {
          width: 65%;
          font-weight: 400;
          color: #c1c1c1;
          text-align: right;
          margin-top: 10px;
          text-decoration: underline;
        }
      }
      > .el-input {
        width: 65%;
        margin-top: 30px;
      }
      .el-button {
        width: 65%;
        margin-top: 30px;
      }
    }
  }
}
// $bg: #2d3a4b;
// $dark_gray: #889aa4;
// $light_gray: #eee;

// .login-container {
//   min-height: 100%;
//   width: 100%;
//   background-color: $bg;
//   overflow: hidden;

//   .login-form {
//     position: relative;
//     width: 520px;
//     max-width: 100%;
//     padding: 160px 35px 0;
//     margin: 0 auto;
//     overflow: hidden;
//   }

//   .tips {
//     font-size: 14px;
//     color: #fff;
//     margin-bottom: 10px;

//     span {
//       &:first-of-type {
//         margin-right: 16px;
//       }
//     }
//   }

//   .svg-container {
//     padding: 6px 5px 6px 15px;
//     color: $dark_gray;
//     vertical-align: middle;
//     width: 30px;
//     display: inline-block;
//   }

//   .title-container {
//     position: relative;

//     .title {
//       font-size: 26px;
//       color: $light_gray;
//       margin: 0px auto 40px auto;
//       text-align: center;
//       font-weight: bold;
//     }
//   }

//   .show-pwd {
//     position: absolute;
//     right: 10px;
//     top: 7px;
//     font-size: 16px;
//     color: $dark_gray;
//     cursor: pointer;
//     user-select: none;
//   }
// }
</style>
