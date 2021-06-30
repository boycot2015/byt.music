<template>
    <div id="contextmenu" @click.stop>
        <div class="menu"
        v-for="menu in contextmenu"
        :key="menu.name">{{menu.name}}</div>
      </div>
</template>
<script>
export default {
    name: 'contextMenu',
    data () {
        return {
            contextmenu: [{
                name: '查看',
                event: 'view'
            }, {
                name: '刷新',
                event: 'refresh'
            }, {
                name: '删除',
                event: 'delete'
            }, {
                name: '重命名',
                event: 'rename'
            }, {
                name: '新建文件夹',
                event: 'makedir'
            }, {
                name: '属性',
                event: 'prop'
            }]
        }
    },
    methods: {
        getColor (val) {
            console.log(val, 'color')
        }
    },
    mounted () {
        window.addEventListener('contextmenu', (e) => {
            // 取消默认的浏览器自带右键 很重要！！
            e.preventDefault()

            // 获取我们自定义的右键菜单
            var menu = document.querySelector('#contextmenu')

            // 根据事件对象中鼠标点击的位置，进行定位
            menu.style.left = e.clientX + 'px'
            menu.style.top = e.clientY + 'px'

            // 改变自定义菜单的宽，让它显示出来
            menu.style.display = 'block'
        })
        // 关闭右键菜单，很简单
        window.onclick = function (e) {
            // 用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
            document.querySelector('#contextmenu').style.display = 'none'
            e.preventDefault()
        }
    }
}
</script>
<style lang="less" scoped>
#contextmenu {
    position: absolute;
    // height: 160px;
    z-index: 999999999;
    background: @white;
    color: @c-333;
    border-radius: 5px;
    width: 120px;
    display: none;
    overflow: hidden;
    box-shadow: 0 5px 10px @c-333;
    user-select: none;
    .menu {
        padding: 0 10px;
        line-height: 32px;
        font-size: 14px;
        color: @c-333;
        &:hover {
            background: @primary;
        }
    }
}
</style>
