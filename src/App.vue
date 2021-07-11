<template>
    <div class="cloud_music">
        <router-view class="cloud_music_main" />
        <!-- docker导航菜单栏 -->
        <!-- <docker></docker> -->
        <!-- 桌面歌词 -->
        <!-- <lyric></lyric>
        <div class="lyric">
            <color-picker @change="getColor" :config="{attr: {defaultValue: '#f54040'}}"></color-picker>
        </div> -->
        <!-- 自定义右键菜单 -->
        <context-menu></context-menu>
    </div>
</template>
<script>
export default {
    methods: {
        getColor (val) {
            console.log(val, 'color')
        }
    }
}
</script>
<style>
#app, .cloud_music {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
