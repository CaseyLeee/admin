<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>


<style lang="less">
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.nest-menu 
{
.el-menu-item{
  padding-left: 50px!important;
}
}
</style>