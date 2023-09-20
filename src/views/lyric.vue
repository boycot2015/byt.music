<template>
    <lyric v-model:isShow="isShow"></lyric>
</template>
<script>
export default {
    data () {
        return {
            isShow: true
        }
    },
    mounted () {
        window.electronAPI && window.electronAPI.onPlaySong(({ playData, currentLyric }) => {
            console.log(playData, currentLyric, '1232')
        })
    }
}
</script>
<style lang="less">
</style>
