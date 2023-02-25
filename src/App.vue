<template>
    <div class="cloud_music flexbox-h align-c just-c">
        <router-view class="cloud_music_main" />
        <!-- docker导航菜单栏 -->
        <!-- <docker></docker> -->
        <!-- <div class="lyric">
            <color-picker @change="getColor" :config="{attr: {defaultValue: '#f54040'}}"></color-picker>
        </div> -->
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
#app.dark-mode-invert {
    /* filter: invert(100%); */
    overflow: hidden;
}
/* #app.dark-mode-invert >.cloud_music {
    filter: invert(100%);
} */
#app.dark-mode-invert >.cloud_music .cloud_music_main {
    filter: invert(100%);
}
#app.dark-mode-invert >.cloud_music .cloud_music_main img {
    filter: invert(100%);
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
