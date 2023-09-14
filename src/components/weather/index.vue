
<template>
    <div class="weather-component" v-show="showWeather">
        <div class="panels now" @click.stop="showDialog" @dblclick.stop="showDialog" v-for="weather in weathers" :key="weather.location">
            <div class="location" v-if="weather && weather.location">{{weather.location.name}}市</div>
            <div class="weather" :style="{'font-size': weather.now.text.length > 3 && '28px'}" v-if="weather && weather.now">{{weather.now.text}}</div>
            <div class="temperature" v-if="weather && weather.now">{{weather.now.temperature}}℃</div>
            <div class="last_update" v-if="weather && weather.last_update">{{new Date(weather.last_update).toLocaleDateString()}}</div>
            <span class="close" @click.stop="showWeather = false">×</span>
        </div>
        <div class="dialog-content" :class="viewMore && 'active'" ref="dialogRef">
            <div class="dialog-main">
                <div class="top">
                    <div class="panels location">
                        <div class="location" v-if="weathers[0] && weathers[0].location">{{weathers[0].location.name}}市</div>
                        <div class="weather" :style="{'font-size': weathers[0].now.text.length > 5 && '34px'}" v-if="weathers[0] && weathers[0].now">{{weathers[0].now.text}}</div>
                        <div class="temperature" v-if="weathers[0] && weathers[0].now">{{weathers[0].now.temperature}}℃</div>
                        <div class="last_update" v-if="weathers[0] && weathers[0].last_update">{{new Date(weathers[0].last_update).toLocaleDateString()}}</div>
                    </div>
                    <div class="panels suggestion">
                        <div class="item" v-for="item in life.suggestion" :key="item.brief">
                            <div class="title">{{item.title}}</div>
                            <div class="cont">{{item.details || item.brief}}</div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="title" v-if="dailyWeather.location">{{dailyWeather.location.name}}市最近3天天气情况</div>
                    <div class="list">
                        <div class="panels" @dblclick="showDialog" v-for="weather in dailyWeather.daily" :key="weather.location">
                            <div class="weather" :style="{'font-size': weather.text_day.length > 3 && '28px'}" v-if="weather && weather.text_day">{{weather.text_day}}</div>
                            <div class="temperature" v-if="weather && weather.high">{{weather.low}}~{{weather.high}}℃</div>
                            <div class="wind" v-if="weather && weather.wind_direction">{{weather.wind_direction}}/{{weather.wind_scale}}级</div>
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
import { apiUrl } from '@/api/baseUrl'
export default {
    setup (props) {
        const state = reactive({
            weathers: [],
            dailyWeather: {},
            showWeather: false,
            viewMore: false,
            life: {
                location: {
                    id: 'WS10730EM8EV',
                    name: '深圳',
                    country: 'CN',
                    path: '深圳,深圳,广东,中国',
                    timezone: 'Asia/Shanghai',
                    timezone_offset: '+08:00'
                },
                suggestion: {
                    dressing: {
                        brief: '炎热',
                        title: '穿衣',
                        details: ''
                    },
                    flu: {
                        brief: '少发',
                        title: '感冒',
                        details: ''
                    },
                    sport: {
                        brief: '较不宜',
                        title: '运动',
                        details: ''
                    },
                    travel: {
                        brief: '较适宜',
                        title: '旅游',
                        details: ''
                    },
                    uv: {
                        brief: '中等',
                        title: '紫外线',
                        details: ''
                    },
                    car_washing: {
                        brief: '不宜',
                        title: '洗车',
                        details: ''
                    }
                },
                last_update: '2021-08-18T18:21:42+08:00'
            }
        })
        const dialogRef = ref(null)
        const MessageBox = inject('messageBox')
        const location = undefined
        const showDialog = () => {
            state.viewMore = false
            state.showWeather = false
            initData()
            initNow()
            MessageBox({
                content: dialogRef.value.innerHTML,
                shadeClose: false,
                title: '',
                drag: true,
                layerStyle: {
                    width: '800px',
                    height: '500px',
                    borderRadius: '15px',
                    padding: '20px 0 0 0',
                    background: 'rgba(0,0,0,0.8)'
                },
                btns: [
                    // { text: '取消', click: () => { $el.close() } },
                    // { text: '确认', class: 'btn-primary', click: () => { $el.close() } }
                ]
            })
        }
        onMounted(() => {
            initData()
            initNow()
            setInterval(() => {
                initData()
            }, 30 * 60 * 1000)
            setInterval(() => {
                initNow()
            }, 15 * 1000)
            window.addEventListener('dblclick', (e) => {
                e.stopPropagation()
                state.showWeather = !state.showWeather
            }, false)
        })
        const initNow = () => {
            axios.get(`${apiUrl}/weather`, { params: { location } })
                .then(res => {
                    if (!res.success) return
                    state.weathers = [res.data]
                })
        }
        const initData = () => {
            axios.get(`${apiUrl}/weather/daily`, { params: { location } })
                .then(res => {
                    if (!res.success) return
                    state.dailyWeather = res.data
                    state.dailyWeather.daily = res.data.daily.map(el => {
                        return {
                            ...el,
                            wind_direction: !el.wind_direction.includes('风') ? el.wind_direction + '风' : el.wind_direction
                        }
                    })
                })
            axios.get(`${apiUrl}/weather/life`, { params: { location } })
                .then(res => {
                    if (!res.success) return
                    state.life.location = res.data.location
                    for (const key in res.data.suggestion) {
                        if (res.data.suggestion[key]) {
                            state.life.location[key] = res.data.suggestion[key]
                        }
                    }
                })
        }
        return {
            ...toRefs(state),
            dialogRef,
            showDialog
        }
    }
}
</script>
<style lang="less" scoped>
.weather-component {
    font-size: 12px;
    width: 180px;
    height: 180px;
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
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    color: #fff;
    flex-direction: column;
    position: relative;
    z-index: 100;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.7);
    // background-image: linear-gradient(45deg, #ccc, yellowgreen);
    background: linear-gradient(-45deg, #496eaa, #944fa8, @primary, yellowgreen, #944fa8, #496eaa);
    background-size:1400% 300%;
    font-size: 18px;
    animation:bgMove 20s ease infinite;
    -webkit-animation: bgMove 20s ease infinite;
    -moz-animation: bgMove 20s ease infinite;
    &.now {
        cursor: pointer;
    }
}
.dialog-content {
    width: 0;
    left: -20px;
    top: -20px;
    height: 180px;
    border-radius: 15px;
    transition: all .5s;
    overflow: hidden;
    position: absolute;
    opacity: 0;
    z-index: 10;
    // transform: translateX(-840px);
    // display: block;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    &.active {
        padding-left: 200px;
        width: 760px;
        // transform: translateX(0);
        opacity: 1;
        .dialog-main {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            .bottom .title,
            .top .panels.location {
                display: none;
            }
            .panels.suggestion {
                margin-right: 10px;
            }
        }
    }
}
.dialog-main {
    .top {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    .panels {
        flex: 1;
        &.suggestion {
            display: flex;
            flex-direction: row;
            margin-left: 10px;
            flex-wrap: wrap;
            padding: 10px 15px;
            box-sizing: border-box;
            .item {
                display: flex;
                flex-basis: 50%;
                text-align: left;
                flex-direction: column;
                &:nth-child(6n),
                &:nth-child(5n) {
                    .cont {
                        padding-bottom: 0;
                        border-bottom: 0;
                    }
                }
                .title {
                    margin: 0;
                    padding-bottom: 0;
                    font-size: 14px;
                    color: @c-ccc;
                    border-bottom: 0;
                }
                .cont {
                    font-size: 20px;
                    padding-bottom: 10px;
                    // border-bottom: 1px solid #e8e8e8;
                }
            }
        }
    }
    .title {
        font-size: 24px;
        margin: 20px 0;
        text-align: left;
        color: @white;
        padding-bottom: 10px;
        // border-bottom: 1px solid #e8e8e8;
    }
    .bottom .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .panels {
            margin-right: 10px;
            .weather {
                margin-top: 0;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
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
.panels {
     .weather {
        font-size: 40px;
        // margin: 10px 0;
    }
    .wind {
        font-size: 16px;
        margin-top: 10px;
    }
    .temperature,
    .last_update {
        margin-top: 10px;
    }
}
.close {
    position: absolute;
    left: 12px;
    top: 8px;
    font-size: 24px;
    color: @white;
    transform: rotate(0deg);
    transition: transform .3s;
    &:hover {
        color: @primary;
        transform: rotate(-90deg);
    }
}
</style>
