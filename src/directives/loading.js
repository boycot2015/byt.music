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

    setFullScreenStyle = (ele, styles) => {
        for (const key in styles) {
            ele.style[key] = styles[key]
        }
        document.querySelector('.main').style.height = '100%'
        document.querySelector('.main').scrollTop = 0
        document.querySelector('.main').style.overflow = 'hidden'
    }
}

const createLoading = (el, data) => {
    const loadingEl = new LoadingInterface()
    if (data.fullScreen) {
        el.style.position = 'relative'
        loadingEl.setFullScreenStyle(
            loadingEl.loadingMask,
            {
                position: 'absolute',
                width: '100%',
                height: '100%',
                minHeight: '500px',
                maxHeight: '100vh',
                top: '0',
                left: '0',
                zIndex: '100',
                margin: '0',
                backgroundColor: 'rgba(245, 245, 245,0.7)'
            })
    }
    loadingEl.loadingMask.appendChild(loadingEl.spinner)
    loadingEl.loadingMask.appendChild(loadingEl.loadingText)
    loadingEl.loadingMask.setAttribute('data-class', el.classList)
    el.appendChild(loadingEl.loadingMask)
}

const hideLoading = (el, { all }) => {
    el.querySelectorAll('.loading-dialog').forEach(ele => {
        if (all) {
            ele.parentNode.removeChild(ele)
        } else if (ele && el.classList.value === ele.getAttribute('data-class')) {
            el.removeChild(ele)
        }
        document.querySelector('.main').style.height = ''
        document.querySelector('.main').style.overflow = 'auto'
        return ele
    })
}
const hasLoading = (el) => {
    let has = false
    el.querySelectorAll('.loading-dialog').forEach(ele => {
        if (ele && el.classList.value === ele.getAttribute('data-class')) {
            has = true
        }
    })
    return has
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
    beforeUpdate (el, binding) {
        let data = {
            loading: binding.value
        }
        if (typeof binding.value === 'object') {
            data = {
                ...binding.value
            }
        }
        hideLoading(el, { all: true, ...data })
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
        if (data.loading) {
            if (!hasLoading(el)) {
                createLoading(el, data)
            } else {
                hideLoading(el, { all: false, ...data })
            }
        } else {
            hideLoading(el, { all: false, ...data })
        }
    },
    beforeUnmount (el, binding) {
        let data = {
            loading: binding.value
        }
        if (typeof binding.value === 'object') {
            data = {
                ...binding.value
            }
        }
        hideLoading(el, { all: true, ...data })
    }
}
