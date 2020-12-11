<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">Face Manage </h1>
      </router-link> -->
      <router-link v-if="!collapse" key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1> -->
        <div class="logo-item">
           <img v-if="logo" :src="logo" class="sidebar-logo">
             <h1 class="sidebar-title">Face Manage </h1>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Vue Admin Template',
      logo: require("../../../assets/img/icon_1.png"),
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-item{
  display: flex;
  flex-direction: column;
  align-items : center;
  justify-content: center;
  height: 100%;
  background-color: #3274EC;
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 200px;
  line-height: 50px;
  background: #3274EC;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 96px;
      height: 96px;
      vertical-align: middle;
      margin-right: 12px;
      border-radius: 50%;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.collapse {
 height: 0px;
}
</style>
