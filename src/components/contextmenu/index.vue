<template>
    <div id="contextmenu" @click.prevent>
        <div class="menu"
        v-for="menu in contextmenu"
        :key="menu.name" @click.stop="(event) => onMenuClick(event, menu)">{{menu.name}}</div>
      </div>
</template>
<script>
import html2canvas from 'html2canvas'
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
                name: '打印',
                event: 'print'
            },
            {
                name: '另存为',
                event: 'saveHtml'
            },
            // {
            //     name: '另存为',
            //     event: 'saveAs'
            // },
            {
                name: '属性',
                event: 'prop'
            }]
        }
    },
    methods: {
        getColor (val) {
            console.log(val, 'color')
        },
        onMenuClick (event, menu) {
            switch (menu.event) {
            case 'refresh':
                window.location.reload()
                break
            case 'print':
                window.print()
                break
            case 'saveAs':
                // 'Saveas'表示打开“文件另存为”对话框命令
                console.log(event, 'event.target')
                html2canvas(document.querySelector('.music-client .music-box'), { scale: 1, logging: false, useCORS: true }).then(canvas => {
                    var url = canvas.toDataURL('png')
                    // 以下代码为下载此图片功能
                    // window.open(url)
                    var triggerDownload = document.createElement('a')
                    triggerDownload.setAttribute('href', url)
                    triggerDownload.classList = 'html2-canvas'
                    triggerDownload.setAttribute('download', 'img.png')
                    document.body.appendChild(triggerDownload)
                    document.querySelector('.html2-canvas').click()
                    document.querySelector('.html2-canvas').remove()
                })
                break
            case 'saveHtml':
                this.exportHtml(document.title + '.html', document.getElementsByTagName('html')[0].outerHTML)
                break
            default:
                break
            }
            document.querySelector('#contextmenu').style.display = 'none'
        },
        getBase64Image (imgurl) {
            var img = new Image()
            img.src = imgurl
            img.setAttribute('crossOrigin', 'anonymous')
            img.onload = function () {
                var canvas = document.createElement('canvas')
                canvas.width = 300// 这个设置不能丢，否者会成为canvas默认的300*150的大小
                canvas.height = 300// 这个设置不能丢，否者会成为canvas默认的300*150的大小
                var ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, 300, 300)
                var dataURL = canvas.toDataURL('image/png')
                console.log(dataURL)
            }
        },
        fakeClick (obj) {
            var ev = document.createEvent('MouseEvents')
            ev.initMouseEvent(
                'click', true, false, window, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
            )
            obj.dispatchEvent(ev)
        },

        exportHtml (name, data) {
            var urlObject = window.URL || window.webkitURL || window
            var exportblob = new Blob([data])
            var savelink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            savelink.href = urlObject.createObjectURL(exportblob)
            savelink.download = name
            this.fakeClick(savelink)
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
            color: @white;
        }
    }
}
</style>
