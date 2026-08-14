<template>
  <div id="app">

    <!--    导航栏-->
    <nav-bar />
    <!--    /导航栏-->

    <div class="main-content">
      <router-view />
    </div>
  </div>

  <div>
    <!--    footer 整个项目固定的部分-->
    <FooterComponent></FooterComponent>

  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: 'App',
  components: {
    FooterComponent,
    NavBar
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
  Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-content {
  margin-top: 64px; /* 导航栏的高度 */
  padding: 20px;
}
</style>
