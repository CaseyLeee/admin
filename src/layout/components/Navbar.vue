<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <span class="navbar-text_1">欢迎使用 Face Manager管理后台！</span>
    
    <div class="right-menu">
      <span class="navbar-text_2">简体中文</span>
      <el-tag type="info">{{ name }}</el-tag>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <el-dropdown class="avatar-container" trigger="click" @command="toggleLang">
        <div class="avatar-wrapper">
       <div>  {{language}}
          <i class="el-icon-caret-bottom" /></div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
         
          <el-dropdown-item divided  v-for="(item) in langList"
            :key="item.lang"
           :command="item.lang" >
            <span style="display:block;">{{item.title}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

      <!-- <div class="lang">
        <li class="center selected" @click="handleExpand">
          <span>{{language}}</span>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" :class="{active:expanded}" />
        </li>
        <ul class="lang-panel" v-show="expanded">
          <li
            :class="{active:lang == item.lang}"
            v-for="(item) in langList"
            :key="item.lang"
            @click="toggleLang(item.lang)"
          >{{item.title}}</li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  data() {
    return {
      expanded: false,
      langList: [
        {
          title: "简体中文",
          lang: "zh",
        },
        {
          title: "English",
          lang: "en",
        },
        {
          title: "русский",
          lang: "ru",
        },
      ],

      lang: "zh",
      language: "简体中文",
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
    },
    handleExpand() {
      this.expanded = !this.expanded;
    },
    toggleLang(lang) {
      this.$i18n.locale = this.lang = lang;
      let { title } = this.langList.find((item) => item.lang == lang);
      this.language = title;
      this.expanded = false;
      this.$ebus.$emit("changeLang", lang);
      window.localStorage.setItem(LANG, lang);
      document.title = this.$t(this.$route.meta.i18n);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar-text_1 {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #3274ec;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.navbar-text_2 {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #36383a;
  margin-right: 10px;
  // position: absolute;
  // top: 50%;
  // right: 12%;
  // transform: translate3d(-50%, -50%, 0);
}
.el-tag {
  margin-right: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;;

    &:focus {
      outline: none;
    }
    > div {
      &:nth-child(2) {
        vertical-align: top;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 50px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
