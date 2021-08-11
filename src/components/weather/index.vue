
<template>
    <div class="weather-component">
        <div class="panels" v-for="weather in weathers" :key="weather.location">
            <div class="location" v-if="weather && weather.location">{{weather.location.name}}市</div>
            <div class="weather" v-if="weather && weather.now">{{weather.now.text}}</div>
            <div class="temperature" v-if="weather && weather.now">{{weather.now.temperature}}℃</div>
            <div class="last_update" v-if="weather && weather.last_update">{{new Date(weather.last_update).toLocaleDateString()}}</div>
        </div>
        <!-- <div class="add-city" @click="addCity()">+</div> -->
    </div>
</template>
<script>
import axios from '@/api/axios'
import { weatherUrl } from '@/api/baseUrl'
export default {
    data () {
        return {
            weathers: []
        }
    },
    created () {
        this.init()
    },
    mounted () {
        setInterval(() => {
            this.init()
        }, 15 * 1000)
    },
    methods: {
        init () {
            axios.get(`${weatherUrl}/weather`)
                .then(res => {
                    if (!res.success) return
                    this.weathers = [res.data]
                })
        }
    }
}
</script>
<style lang="less" scoped>
.weather-component {
    font-size: 12px;
    width: 200px;
    height: 200px;
    display: flex;
    position: fixed;
    z-index: 10;
    left: 50px;
    top: 30px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.add-city {
    font-size: 36px;
    margin-top: 10px;
    cursor: pointer;
}
.panels {
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #fff;
    flex-direction: column;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.7);
    // background-image: linear-gradient(45deg, #ccc, yellowgreen);
    background: linear-gradient(-45deg, #496eaa, #944fa8, @primary, yellowgreen, #944fa8, #496eaa);
    background-size:1400% 300%;
    font-size: 18px;
    animation:bgMove 30s ease infinite;
    -webkit-animation: bgMove 30s ease infinite;
    -moz-animation: bgMove 30s ease infinite;
}
@keyframes bgMove {
    0% {
        background-position: 0% 0%; }
    25% {
        background-position: 25% 100%; }
    50% {
        background-position: 50% 100%; }
    75% {
        background-position: 75% 100%; }
    100% {
        background-position: 100% 0%;
    }
}
.panels .weather{
    font-size: 48px;
    margin: 10px 0;
}
.panels .last_update {
    margin-top: 20px;
}
</style>
