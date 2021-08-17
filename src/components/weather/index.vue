
<template>
    <div class="weather-component">
        <div class="panels" @dblclick="showDialog" v-for="weather in weathers" :key="weather.location">
            <div class="location" v-if="weather && weather.location">{{weather.location.name}}市</div>
            <div class="weather" v-if="weather && weather.now">{{weather.now.text}}</div>
            <div class="temperature" v-if="weather && weather.now">{{weather.now.temperature}}℃</div>
            <div class="last_update" v-if="weather && weather.last_update">{{new Date(weather.last_update).toLocaleDateString()}}</div>
        </div>
        <div class="dialog-content" ref="dialogRef" style="display:none;">
            <div class="dialog-main">
                <div class="top">
                    <div class="panels">
                        <div class="location" v-if="weathers[0] && weathers[0].location">{{weathers[0].location.name}}市</div>
                        <div class="weather" v-if="weathers[0] && weathers[0].now">{{weathers[0].now.text}}</div>
                        <div class="temperature" v-if="weathers[0] && weathers[0].now">{{weathers[0].now.temperature}}℃</div>
                        <div class="last_update" v-if="weathers[0] && weathers[0].last_update">{{new Date(weathers[0].last_update).toLocaleDateString()}}</div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="title" v-if="dailyWeather.location">{{dailyWeather.location.name}}市最近3天天气情况</div>
                    <div class="list">
                        <div class="panels" @dblclick="showDialog" v-for="weather in dailyWeather.daily" :key="weather.location">
                            <div class="weather" v-if="weather && weather.text_day">{{weather.text_day}}</div>
                            <div class="temperature" v-if="weather && weather.high">{{weather.high}}℃</div>
                            <div class="last_update" v-if="weather && weather.date">{{new Date(weather.date).toLocaleDateString()}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="add-city" @click="addCity()">+</div> -->
    </div>
</template>
<script>
import axios from '@/api/axios'
import {
    inject,
    reactive,
    toRefs,
    ref,
    onMounted
} from 'vue'
import { weatherUrl } from '@/api/baseUrl'
export default {
    data () {
        return {
            weathers: [],
            dailyWeather: {}
        }
    },
    setup (props) {
        const state = reactive({
            dailyWeather: {}
        })
        const dialogRef = ref(null)
        const MessageBox = inject('messageBox')
        const showDialog = () => {
            MessageBox({
                content: dialogRef.value.innerHTML,
                shadeClose: false,
                title: '',
                layerStyle: {
                    width: '800px',
                    height: '560px',
                    background: 'rgba(0,0,0,0.8)'
                },
                btns: [
                    // { text: '取消', click: () => { $el.close() } },
                    // { text: '确认', class: 'btn-primary', click: () => { $el.close() } }
                ]
            })
        }
        onMounted(() => {
            axios.get(`${weatherUrl}/weather/daily`)
                .then(res => {
                    if (!res.success) return
                    state.dailyWeather = res.data
                })
        })
        return {
            ...toRefs(state),
            dialogRef,
            showDialog
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
    animation:bgMove 20s ease infinite;
    -webkit-animation: bgMove 20s ease infinite;
    -moz-animation: bgMove 20s ease infinite;
}
.dialog-main {
    margin-top: 20px;
    .top {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .panels {
        flex: 1;
    }
    .title {
        font-size: 24px;
        margin: 20px 0;
        text-align: left;
        color: @white;
        padding-bottom: 10px;
        border-bottom: 1px solid #e8e8e8;
    }
    .bottom .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .panels {
            margin: 0 10px;
        }
    }
}
@keyframes bgMove {
    0% {
        background-position: 0% 0%; }
    25% {
        background-position: 50% 50%; }
    50% {
        background-position: 50% 100%; }
    75% {
        background-position: 100% 50%; }
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
