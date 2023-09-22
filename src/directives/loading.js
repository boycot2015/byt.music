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
const createLoading = (el, data) => {
    const loadingEl = new LoadingInterface()
    loadingEl.loadingMask.appendChild(loadingEl.spinner)
    loadingEl.loadingMask.appendChild(loadingEl.loadingText)
    if (data.fullScreen) {
        el.style.position = 'relative'
        loadingEl.loadingMask.style.position = 'absolute'
        loadingEl.loadingMask.style.width = '100%'
        loadingEl.loadingMask.style.height = '100%'
        loadingEl.loadingMask.style.minHeight = '500px'
        loadingEl.loadingMask.style.maxHeight = '80vh'
        loadingEl.loadingMask.style.top = '0'
        loadingEl.loadingMask.style.left = '0'
        loadingEl.loadingMask.style.zIndex = '100'
        loadingEl.loadingMask.style.margin = '0'
        loadingEl.loadingMask.style.backgroundColor = 'rgba(245, 245, 245,0.7)'
        document.querySelector('.main').style.height = '100%'
        document.querySelector('.main').style.overflow = 'hidden'
    }
    el.appendChild(loadingEl.loadingMask)
}

const hideLoading = (el) => {
    const loadingEl = el.querySelector('.loading-dialog')
    if (loadingEl && loadingEl.parentNode.classList.value === el.classList.value) {
        // console.log(loadingEl.parentNode.classList.value, el.classList.value, 'parentNode')
        el.removeChild(loadingEl)
        document.querySelector('.main').style.height = ''
        document.querySelector('.main').style.overflow = 'auto'
    }
}
const hasLoading = (el) => {
    return !!el.querySelector('.loading-dialog')
}
export default {
    mounted (el, binding) {
        let data = {
            loading: binding.value
        }
        if (typeof binding.value === 'object') {
            data = {
                ...binding.value
            }
        }
        if (!hasLoading(el)) createLoading(el, data)
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
        if (data.loading && !data.fullScreen) {
            if (!hasLoading(el)) {
                createLoading(el, data)
            } else {
                hideLoading(el)
            }
        } else {
            hideLoading(el)
        }
    }
}
