<template>
  <div class="desk-top">
      <div class="content cleafix" @click.prevent="activeIndex = ''" :style="getStyles()">
          <div class="icons fl"
          @mouseleave="activeIndex = ''"
          @click="onIconClick(icon, index)"
          @mouseenter="activeIndex = index"
          :class="{active: activeIndex === index || icon.active}"
          v-for="(icon, index) in deskList"
           :key="icon.name">
              <div class="img" :style="{background: icon.color}"></div>
              <div class="name">{{icon.name}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import {
    // ref,
    // computed,
    // watch,
    reactive,
    onMounted,
    // onUpdated,
    toRefs
    // onBeforeMount
    // getCurrentInstance
} from 'vue'
import { getLocalColors } from '@/utils'
// import {
//     useStore
// } from 'vuex'
// import {
//     useRouter
// } from 'vue-router'
export default {
    setup () {
        const state = reactive({
            deskList: [],
            activeIndex: ''
        })
        for (let index = 0; index < 50; index++) {
            state.deskList.push({
                name: '图标' + index,
                url: '',
                active: false,
                color: getLocalColors().themeColor.primary
            })
        }
        const getStyles = () => {
            const styles = {
                width: 'auto',
                height: '100%'
            }
            switch (state.deskList.length) {
            case 10:
                styles.width = 70
                break
            case 20:
                styles.width = 140
                break
            case 30:
                styles.width = 210
                break
            case 40:
                styles.width = 280
                break
            case 50:
                styles.width = 350
                break

            default:
                break
            }
            styles.width += 'px'
            return styles
        }
        const onIconClick = (icon, index) => {
            state.activeIndex = index
            state.deskList.map((el, idx) => {
                if (idx === index) {
                    el.active = true
                } else {
                    el.active = false
                }
            })
        }
        onMounted(() => {
        })
        return {
            ...toRefs(state),
            onIconClick,
            getStyles
        }
    }
}
</script>

<style lang="less" scoped>
.desk-top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .content {
        .icons {
            margin: 5px;
            padding: 10px;
            border-radius: 5px;
            &.active {
                background-color: rgba(255, 255, 255, 0.5);
            }
            .img {
                overflow: hidden;
                border-radius: 10px;
                width: 60px;
                height: 60px;
                background: @primary;
            }
            .name {
                text-align: center;
                margin-top:8px;
                font-size: 16px;
                color: @primary;
            }
        }
    }
}
</style>
