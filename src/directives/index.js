/**
 * 加载动画类
 */
class LoadingInterface {
    constructor (props) {
        this.props = props
        this.loadingMask = document.createElement('div')
        this.loadingText = document.createElement('span')
        this.spinner = document.createElement('div')
        this.spinner.classList = 'spinner'
        for (let index = 0; index < 5; index++) {
            this.spinnerItem = document.createElement('div')
            this.spinnerItem.classList = 'rect' + (index + 1)
            this.spinner.appendChild(this.spinnerItem)
        }
        this.loadingText.classList = 'loading-text'
        this.loadingMask.classList = 'loading-dialog flexbox-h just-c'
        this.loadingText.innerHTML = '加载中...'
    }
}
const loadingEles = []

export const loading = {
    mounted (el, binding) {
        let data = {
            loading: binding.value
        }
        if (typeof binding.value === 'object') {
            data = {
                ...binding.value
            }
        }
        let loadingEl = { $el: new LoadingInterface(), id: loadingEles.length + 1 }
        loadingEles.push(loadingEl)
        if (data.loading) {
            if (data.fullScreen) {
                loadingEl.$el.loadingMask.style.position = 'absolute'
                loadingEl.$el.loadingMask.style.width = '100%'
                loadingEl.$el.loadingMask.style.height = '100%'
                loadingEl.$el.loadingMask.style.top = '0'
                loadingEl.$el.loadingMask.style.left = '0'
                loadingEl.$el.loadingMask.style.margin = '0'
                loadingEl.$el.loadingMask.style.backgroundColor = 'rgba(255,255,255,0.7)'
                document.querySelector('.main').style.height = '100%'
                document.querySelector('.main').style.overflow = 'hidden'
            }
            el.setAttribute('loading-tag', loadingEl.id)
            loadingEl.$el.loadingMask.appendChild(loadingEl.$el.spinner)
            loadingEl.$el.loadingMask.appendChild(loadingEl.$el.loadingText)
            el.appendChild(loadingEl.$el.loadingMask)
        } else {
            const id = el.getAttribute('loading-tag')
            loadingEl = loadingEles.filter(el => el.id === +id)[0] || {}
            document.querySelector('.main').style.height = ''
            document.querySelector('.main').style.overflow = 'auto'
            loadingEl.$el && el.removeChild(loadingEl.$el.loadingMask)
        }
    },
    inserted (el, binding) {
    },
    updated (el, binding) {
        let data = {
            loading: binding.value
        }
        if (typeof binding.value === 'object') {
            data = {
                ...binding.value
            }
        }
        const id = el.getAttribute('loading-tag')
        const loadingEl = loadingEles.filter(el => el.id === +id)[0] || {}
        if (data.loading) {
            loadingEl.$el.loadingMask.style.display = 'flex'
            if (data.fullScreen) {
                document.querySelector('.main').style.height = '100%'
                document.querySelector('.main').style.overflow = 'hidden'
            }
        } else if (!data.loading && el.querySelector('.loading-dialog') !== null) {
            document.querySelector('.main').style.height = ''
            document.querySelector('.main').style.overflow = 'auto'
            loadingEl.$el.loadingMask.style.display = 'none'
        }
    }
}
