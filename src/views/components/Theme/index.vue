<template>
    <div class="byt-theme theme-dialog">
        <div class="theme-dialog-title">
            <div class="icon-close" @click="toggleModal">×</div>
            选择主题
        </div>
        <div class="theme-dialog-body">
            <div class="sub-title">主题颜色</div>
            <div class="colors-list">
                <div class="colors-list-item"
                :style="{
                    backgroundColor: color.primary
                }"
                :class="{active: colorIndex === index}"
                @click="() => {colorIndex = index;changeTheme('', {themeColor: color, colorIndex: index})}" v-for="(color, index) in colors" :key="color">
                </div>
            </div>
            <div class="sub-title">精选壁纸<span>&nbsp;&nbsp;|&nbsp;&nbsp;夜间模式</span><span class="icon-night" :class="{'active': isNight}" @click="changeNight"></span></div>
            <div class="pic-list">
                <div class="pic-list-item"
                :class="{active: picIndex === index}"
                @click="() => {picIndex = index;changeTheme('', {bgUrl: pic, bgUrlIndex: index})}" v-for="(pic, index) in localBgUrls" :key="pic">
                <img :src="pic" alt="">
                </div>
            </div>
            <div class="sub-title">在线壁纸</div>
            <ul class="cate-list flexbox-h">
                <li class="cate-list-item"
                :class="{active: cateIndex === item.old_id}"
                @click="onCateChange(item)"
                v-for="item in cateList"
                :key="item.old_id">
                    {{item.show_name}}
                </li>
            </ul>
            <div class="pic-list">
                <div class="pic-list-item"
                :class="{active: picIndex === pic.id}"
                @click="() => {picIndex = pic.id;changeTheme('', {bgUrl: pic.url, bgUrlIndex: pic.id})}"
                v-for="pic in picData" :key="pic.id">
                    <img :src="pic.url" alt="">
                </div>
            </div>
            <div class="more-btn" v-if="total > picData.length" @click="loadingMore">加载更多 ></div>
        </div>
    </div>
</template>

<script>
import {
    // ref,
    // computed,
    // watch,
    reactive,
    // onMounted,
    // onUpdated,
    toRefs,
    onBeforeMount
} from 'vue'
import {
    useStore
} from 'vuex'
import {
    // drag,
    changeTheme
} from '@/utils'
import { wallpaper } from '@/api/apiList'
export default {
    emits: {
        closeModal: val => {
            console.log(val, 'valvalvalval')
            return true
        }
    },
    setup (props, context) {
        const state = reactive({
            isNight: false,
            picIndex: 0,
            cateIndex: 0,
            colorIndex: 0,
            colors: [],
            localBgUrls: [],
            picData: [],
            cateList: [],
            pageno: 1,
            count: 15,
            total: 0,
            progressPsition: '',
            activeIndex: 0
        })
        onBeforeMount(async () => {
            const cateList = await wallpaper.getCategory()
            const newestList = await wallpaper.newestList({ pageno: state.pageno, count: state.count })
            state.cateList = [{
                category: '最新',
                hot_tag: [],
                old_id: 0,
                position: '',
                show_name: '最新'
            }, ...cateList.data]
            state.picData = newestList.data.list
            state.total = newestList.data.total_count
        })
        changeTheme().then(res => {
            const store = useStore()
            state.picIndex = res.bgUrlIndex
            state.colorIndex = res.colorIndex
            state.localBgUrls = res.bgUrlList
            state.colors = res.colors
            store.dispatch('themeChanged', !store.state.themeChanged)
        })
        const toggleModal = () => {
            context.emit('close-modal', true)
        }
        const changeNight = () => {
            state.isNight = !state.isNight
            state.isNight && (document.querySelector('#app').classList = 'dark-mode-invert')
            !state.isNight && (document.querySelector('#app').classList = '')
        }
        const onCateChange = async (item) => {
            let newestList = []
            state.pageno = 1
            state.cateIndex = item.old_id
            if (item.old_id) {
                newestList = await wallpaper.GetListByCategory({ cids: item.old_id, count: state.count })
            } else {
                newestList = await wallpaper.newestList({ pageno: state.pageno, count: state.count })
            }
            state.picData = newestList.data.list
            state.total = newestList.data.total_count
        }
        const loadingMore = async () => {
            state.pageno++
            let newestList = []
            if (state.cateIndex) {
                newestList = await wallpaper.GetListByCategory({
                    pageno: state.pageno,
                    cids: state.cateIndex,
                    count: state.count
                })
            } else {
                newestList = await wallpaper.newestList({
                    pageno: state.pageno,
                    count: state.count
                })
            }
            state.picData = [...state.picData, ...newestList.data.list]
            state.total = newestList.data.total_count
        }
        return {
            changeTheme,
            changeNight,
            toggleModal,
            onCateChange,
            loadingMore,
            // ...computed(() => storeState).value,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="less" scoped>
.theme-dialog {
    position: fixed;
    right: 0;
    top: 0;
    width: 640px;
    transition: all 0.3s;
    transform: translateX(460px);
    opacity: 0;
    z-index: 1000;
    height: 100%;
    &.active {
        opacity: 1;
        transform: translateX(0px);
    }
    .sub-title {
        color: @white;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 10px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        border-left: 4px solid @primary;
        .icon-night {
            display: inline-block;
            margin-left: 20px;
            width: 20px;
            padding: 2px 10px;
            border-radius: 30px;
            overflow: hidden;
            height: 14px;
            background: rgba(0, 0, 0, .8);
            position: relative;
            transition: all .3s;
            background-color: @primary;
            &::after {
                content: "";
                position: absolute;
                width: 14px;
                height: 14px;
                border-radius: 14px;
                top: 2px;
                left: 2px;
                transition: all .3s;
                background-color: @white;
            }
            &.active {
                &::after {
                    content: "";
                    position: absolute;
                    // right: 2px;
                    left: 24px;
                    background-color: @c-000;
                }
            }
        }
    }
    &-title {
        position: relative;
        line-height: 40px;
        height: 40px;
        font-size: 18px;
        color: @white;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.9);
        // border-bottom: 1px solid @c-ccc;
    }
    &-body {
        padding: 20px;
        overflow: hidden;
        overflow-y: auto;
        height: calc(100% - 80px);
        background-color: rgba(0, 0, 0, 0.8);
    }
    &-footer {
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
        border-top: 1px solid @c-ccc;
        .btns {
            span {
                padding: 5px 10px;
                font-size: 14px;
                color: @white;
                border-radius: 3px;
                border: 1px solid @c-ccc;
                margin-right: 20px;
                cursor: pointer;
                transition: all 0.5s;
                &:hover {
                    background-color: @white;
                    color: @c-333;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
    .pic-list {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        &-item {
            margin-bottom: 15px;
            margin-right: 20px;
            height: 100px;
            width: 180px;
            cursor: pointer;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 10px;
            border: 2px solid @c-e8;
            background: @c-e8;
            &.active {
                border-color: @primary;
            }
            img {
                // height: 200px;
                width: 100%;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
    }
    .colors-list {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        &-item {
            width: 40px;
            height: 40px;
            border-radius: 3px;
            margin-right: 14px;
            margin-bottom: 18px;
            position: relative;
            overflow: hidden;
            &:nth-child(11n) {
                margin-right: 0;
            }
            &.active::after {
                content: '';
                display: block;
                position: absolute;
                bottom: -14px;
                right: -14px;
                width: 0;
                height: 0;
                border-width: 14px;
                border-color: var(--white);
                border-style: solid;
                transform: rotateZ(45deg);
            }
        }
    }
    .icon-close {
        position: absolute;
        left: -41px;
        padding: 0 12px;
        background: rgba(0,0,0,0.5);
        top: 0px;
        font-size: 28px;
        cursor: pointer;
        color: @white;
        transition: all 0.3s;
        border-radius: 5px 0 0 5px;
        &:hover {
            // transform: rotateZ(90deg);
            color: @primary;
        }
    }
    .cate-list {
        flex-wrap: wrap;
        margin-bottom: 10px;
        &-item {
            margin-right: 20px;
            margin-bottom: 5px;
            cursor: pointer;
            color: @white;
            font-size: 14px;
            line-height: 24px;
            transition: all 0.3s;
            border-bottom: 2px solid transparent;
            &:hover {
                color: @primary;
            }
            &.active {
                color: @primary;
                border-bottom: 2px solid @primary;
            }

        }
    }
    .more-btn {
        text-align: center;
        line-height: 32px;
        color: @c-666;
        &:hover {
            color: @primary;
            cursor: pointer;
        }
    }
}
</style>
