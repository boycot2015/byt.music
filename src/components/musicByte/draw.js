// todo:添加通用的缓冲运动
export const Tools = {
    toDoubleDigits: function (num) {
        var t = num.toString()
        if (t.length < 2) {
            t = '0' + t
        }
        return t
    },
    toTime: function (secn) {
        return this.toDoubleDigits(Math.floor(secn / 60)) + ':' +
            this.toDoubleDigits(Math.floor(secn % 60))
    },
    addStyleBufferAnimate: function (obj, json, t, fnEnd) {
        clearInterval(obj.timer) // 每个对象使用不同且唯一的计时器。
        obj.timer = setInterval(function () {
            var stop = true
            for (var attr in json) {
                var cur = 0
                // 用getStyle取样式的现值存入cur
                if (attr === 'opacity') { // 透明度分开计算
                    cur = parseFloat(getStyle(obj, attr)) * 100
                } else {
                    cur = parseInt(getStyle(obj, attr))
                }

                var speed = (json[attr] - cur) / 10 // 缓冲运动使用的公式
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
                if (cur !== json[attr]) stop = false
                if (attr === 'opacity') {
                    obj.style.filter = 'alpha(opacity):' + (cur + speed) + ')' // IE
                    obj.style.opacity = (cur + speed) / 100 // Chrome,FireFox
                } else {
                    obj.style[attr] = cur + speed + 'px' // 更新样式
                }
            }
            if (stop) {
                clearInterval(obj.timer)
                if (fnEnd) fnEnd()
            }
        }, t)

        function getStyle (obj, name) {
            if (obj.currentStyle) {
                return obj.currentStyle[name]
            } else {
                return getComputedStyle(obj, false)[name]
            }
        }
    },
    addDomBufferAnimate: function (obj, json, t, fnEnd) {
        clearInterval(obj.timer) // 每个对象使用不同且唯一的计时器。
        obj.timer = setInterval(function () {
            var stop = true
            for (var attr in json) {
                var cur = obj[attr]
                var speed = (json[attr] - cur) / 10 // 缓冲运动使用的公式
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
                if (cur !== json[attr]) {
                    stop = false
                }
                obj[attr] = cur + speed // 更新样式
            }
            if (stop) {
                clearInterval(obj.timer)
                if (fnEnd) fnEnd()
            }
        }, t)
    },
    random: function (m, n) {
        return Math.round(Math.random() * (n - m) + m)
    },
    loadLyric: function (url, succFn, failFn) {
        var request = new XMLHttpRequest()

        request.open('GET', url, true)
        request.responseType = 'text'
        request.onload = function () {
            if ((this.status >= 200 && this.status < 300) || this.status === 304) {
                var resText = request.responseText
                succFn && succFn(resText)
            } else {
                failFn && failFn()
            }
        }
        request.send()
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        }
    },
    preventDefault: function (evnet) {
        if (event.preventDefault) {
            event.preventDefault()
        } else {
            event.returnValue = false
        }
    }
}
export const Monitor = {
    maxFrame: 0,
    minFrame: 9999,
    currFrame: 0,
    currTime: 0,
    elapseTime: 0,
    _sTime: 0,
    _sTFrame: 0,
    start: function () {
        this.currTime = this._sTime = new Date()
    },
    update: function () {
        var fTime = new Date()
        if (fTime - this._sTime >= 1000) {
            this.currFrame = this._sTFrame
            this.maxFrame = (this.currFrame > this.maxFrame) ? this.currFrame : this.maxFrame
            this.minFrame = (this.currFrame < this.minFrame) ? this.currFrame : this.minFrame
            this._sTFrame = 0
            this._sTime = fTime
        } else {
            ++this._sTFrame
        }
        this.elapseTime = fTime - this.currTime
        this.currTime = fTime
    }
}
export const Player = {
    audioObj: null,
    currentID: 0,
    playList: [],
    cycle: 2,
    init: function () {
        this.audioObj = new Audio()
    },
    add: function (name, url, lyurl) {
        this.playList.push({
            name: name,
            url: url,
            lyricUrl: lyurl || null
        })
    },
    remove: function (name) {
        delete this.playList[name]
    },
    setCycle: function (num) {
        num = Math.floor(num % 3)
        this.cycle = num
    },
    isPause: function () {
        return this.audioObj.paused
    },
    load: function (url, succFN, failFN) {
        var request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'blob'
        request.onload = function () {
            if ((this.status >= 200 && this.status < 300) || this.status === 304) {
                var resUrl = URL.createObjectURL(this.response)
                succFN && succFN(resUrl)
            } else {
                failFN && failFN()
            }
        }
        request.send()
    },
    play: function (index) {
        var song = this.playList[index]
        if (song != null) {
            if (this.audioObj.readyState === 4 && this.currentID === index) {
                this.audioObj.play()
            } else {
                this.currentID = index
                this.pause()
                var url = song.url
                var _this = this
                this.load(url, function (resUrl) {
                    _this.audioObj.src = resUrl
                    _this.audioObj.load()
                    _this.audioObj.play()
                })
            }
        }
        return song
    },
    pause: function () {
        this.audioObj.pause()
    },
    playStep: function (step) {
        if (this.playList.length < 1) {
            return null
        } else if (this.currentID == null) {
            return this.play(0)
        } else {
            var id = this.currentID + step
            id = (id > this.playList.length - 1) ? id % this.playList.length : id
            id = (id < 0) ? this.playList.length - 1 : id
            return this.play(id)
        }
    },
    next: function () {
        var step
        switch (this.cycle) {
        case 0:
        case 1:
            step = 1
            break
        case 2:
            step = Tools.random(1, this.playList.length - 1)
            break
        }
        return this.playStep(step)
    },
    prev: function () {
        return this.playStep(-1)
    },
    ended: function () {
        var step
        switch (this.cycle) {
        case 0:
            step = 1
            break
        case 1:
            step = 0
            break
        case 2:
            step = Tools.random(1, this.playList.length - 1)
            break
        }
        return this.playStep(step)
    }
}
export const AudManager = {
    ctx: null,
    analyser: null,
    gain: null,
    source: null,
    init: function () {
        try {
            this.ctx = new AudioContext()
        } catch (e) {
            this.ctx = null
            console.log("Your browser can't support Audio API!")
        }
        if (this.ctx !== null && this.ctx instanceof AudioContext) {
            this.source = this.ctx.createMediaElementSource(Player.audioObj)
            this.gain = this.ctx.createGain()
            this.analyser = this.ctx.createAnalyser()
            this.source.connect(this.gain)
            this.gain.connect(this.analyser)
            this.analyser.connect(this.ctx.destination)
            this.analyser.smoothingTimeConstant = 0.7
            this.analyser.fftSize = 128
        }
    },
    setGain: function (vol) {
        this.gain.gain.value = vol
    },
    setSmooth: function (smo) {
        this.analyser.smoothingTimeConstant = smo
    },
    getData: function (arr) {
    }
}
export const Drawer = {
    ctx: null,
    width: 0,
    height: 0,
    Dots: [],
    drawIndex: 0,
    size: (function () {
        if (AudManager.analyser !== null) {
            return AudManager.analyser.fftSize / 4
        } else {
            return 10
        }
    }()),
    animateID: null,
    init: function (canvas, options = {}) {
        // todo: test canvas
        this.ctx = canvas.getContext('2d')
        this.ctx = canvas.getContext('2d')
        this.width = options.width || canvas.offsetWidth
        this.height = options.height || canvas.offsetHeight
        this.drawIndex = options.drawIndex || 0
    },
    setSize: function (s) {
        // todo:test parameter is 2^n
        this.size = s
        AudManager.analyser.fftSize = 4 * this.size
    },
    setSmooth: function (s) {
        AudManager.analyser.smoothingTimeConstant = s // todo: move it to audManager
    },
    visualizer: function () {
        const _this = this
        window.cancelAnimationFrame(this.animateID)
        const array = new Uint8Array(this.size)
        let draw
        this.ctx.fillStyle = ''
        this.ctx.strokeStyle = ''
        this.ctx.shadowBlur = 0

        switch (this.drawIndex) {
        case 0:
            this.addLineargrandient()
            this.getDots()
            draw = function (arr) {
                _this.columnDraw(arr)
            }
            break
        case 1:
            this.getDots()
            draw = function (arr) {
                _this.bubbleDraw(arr)
            }
            break
        case 2:
            // this.getDots();
            this.setSmooth(0.85)
            this.addShadow()
            draw = function (arr) {
                _this.phosphorDraw(arr)
            }
            break
        case 3:
            this.setSmooth(0.9)
            this.addLineargrandient()
            draw = function (arr) {
                _this.squareDraw(arr)
            }
            break
        case 5:
            this.setSmooth(0.9)
            this.getDots()
            // this.addShadow()
            draw = function (arr) {
                _this.spiralDraw(arr)
            }
            break
        }
        // this.phosphorColoring()
        Monitor.start()
        function v () {
            AudManager.analyser.getByteFrequencyData(array)
            _this.ctx.clearRect(-1000, -1000, _this.width + 1000, _this.height + 1000)
            // _this.columnDraw(array);
            // _this.phosphorDraw(array)
            draw(array)
            Monitor.update()
            _this.animateID = requestAnimationFrame(v)
        }
        requestAnimationFrame(v)
        draw(array)
        // _this.phosphorDraw(array)
        // this.columnDraw(array);
    },
    getDots: function () {
        this.Dots = []
        for (let i = 0; i < this.size; i++) {
            const random = Tools.random
            const x = random(0, this.width)
            const y = random(0, this.height)
            const dx = random(2, 5)
            const dy = random(2, 5)
            const color = 'rgba(' + random(200, 255) + ',' + random(66, 200) + ',' + random(66, 200) + ',' + random(0.6, 1) + ')'
            const color2 = 'rgba(' + random(200, 255) + ',' + random(66, 200) + ',' + random(66, 200) + ',' + random(0.1, 0.5) + ')'
            this.Dots.push({
                x: x,
                y: y,
                dx: dx,
                dy: dy,
                color: color,
                color2: color2,
                cap: 0
            })
        }
    },
    addLineargrandient: function () {
        const lineargrandient = this.ctx.createLinearGradient(0, this.height, 0, 0)
        lineargrandient.addColorStop(0, '#ff9966')
        lineargrandient.addColorStop(0.5, '#99ff66')
        lineargrandient.addColorStop(0.8, '#9966ff')
        lineargrandient.addColorStop(1, '#6699ff')
        this.ctx.fillStyle = lineargrandient
    },
    columnDraw: function (arr) {
        let t = 0.6 * this.width / this.size
        t = (t > 20) ? 20 : t
        const d = 0.1 * this.height
        for (let i = 0; i < this.size; i++) {
            const o = this.Dots[i]
            const x = Math.floor(i * this.width / this.size)
            const w = 0.8 * (Math.floor((i + 1) * this.width / this.size) - x)
            const h = arr[i] / 256 * (this.height - t)
            const v = 0.5 + (o.cap - h) / (0.2 * this.height) // buffer movement
            o.cap -= v
            if (o.cap < 0) {
                o.cap = 0
            }
            if (h > 0 && h + d > o.cap) {
                o.cap = h + d
            }
            if (o.cap > this.height - t) {
                o.cap = this.height - t
            }

            this.ctx.fillRect(x, this.height, w, -h)
            this.ctx.fillRect(x, this.height - o.cap, w, -t)
        }
    },
    bubbleDraw: function (arr) {
        for (let i = 0; i < this.size; i++) {
            const o = this.Dots[i]
            const r = 6 + arr[i] / 256 * (this.height > this.width ? this.width : this.height) / 10
            const g = this.ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r)
            g.addColorStop(0, o.color2)
            g.addColorStop(1, o.color)
            this.ctx.beginPath()
            this.ctx.arc(o.x, o.y, r, 0, Math.PI * 2, true)
            this.ctx.fillStyle = g
            this.ctx.fill()
            o.x += o.dx
            o.x = o.x > this.width ? 0 : o.x
        }
    },
    addShadow: function () {
        // let backImage = new Image();
        // backImage.src="../public/images/146752285666.jpg";
        // let _this = this;
        // backImage.onload = function(){
        //     _this.ctx.fillStyle = "url('http://www.samskirrow.com/background.png')";
        //     //_this.ctx.drawImage(backImage, 0, 0);
        // };

        // this.ctx.shadowColor = "#ff6699";
        // this.ctx.shadowBlur = 30;
        // this.ctx.shadowOffsetX = 0;
        // this.ctx.shadowOffsetY = 0;
        // this.ctx.fillStyle = "#ffaacc"

        this.ctx.shadowColor = '#0033ff'
        this.ctx.shadowBlur = 1
        this.ctx.shadowOffsetX = 0
        this.ctx.shadowOffsetY = 0
        this.ctx.fillStyle = 'white'
        // this.ctx.shadowColor = "black";
        // this.ctx.shadowBlur = 1;
        // this.ctx.shadowOffsetX = 0;
        // this.ctx.shadowOffsetY = 0;
    },
    phosphorDraw: function (arr) {
        this.ctx.fillRect(0, this.height / 2 + 1, this.width, -1)
        let t = 0.6 * this.width / this.size
        t = (t > 20) ? 20 : t
        // const d = 0.1 * this.height
        for (let i = 0; i < this.size; i++) {
            const x = Math.floor(i * this.width / this.size)
            const w = 0.6 * (Math.floor((i + 1) * this.width / this.size) - x)
            const h = arr[i] / 256 * (this.height - t)
            this.ctx.fillRect(x, this.height / 2 + h / 2, w, -h)
        }
    },
    squareDraw: function (arr) {
        let t = 0.6 * this.width / this.size
        t = (t > 20) ? 20 : t
        // const d = 0.1 * this.height
        const w = Math.round(this.width / this.size)

        for (let i = 0; i < this.size; i++) {
            const x = i * w
            const h = arr[i] / 256 * (this.height - t)
            for (let j = 0; j < h / w; j++) {
                this.ctx.fillStyle = 'rgba(' + Math.floor(i / this.size * 256) + ',' + arr[i] + ',' + j * w / h * 256 + ',1)'
                this.ctx.fillRect(x, this.height - w * j, 0.9 * w, -0.9 * w)
            }
        }
    },
    getDots2: function () {
        this.Dots = []
        for (let i = 0; i < this.size; i++) {
            const dx = 2 + 2 * Math.random()
            const dy = -(2 + 2 * Math.random())
            // let color = "rgba(" + random(200, 255) + ","+ random(66, 200) + "," + random(66, 200) + "," + random(0.6, 1)+")";
            // let color2 = "rgba(" + random(200,255)+","+random(66,200)+","+random(66,200)+","+random(0.1,0.5)+")";
            this.Dots.push({
                x: 0,
                y: 200,
                dx: dx,
                dy: dy,
                color: '',
                color2: '',
                cap: 1
            })
        }
    },
    spiralDraw: function (arr) {
        this.ctx.lineWidth = 2
        let r = 10
        this.ctx.translate(this.width / 2, this.height / 2)
        let avg = 0
        const avgArr = [0]
        for (let i = 0, j = 1; i < this.size; i++) {
            if (i === (j * this.size / 8 - 1)) {
                avgArr.push(avg)
                j++
            }
            avg += arr[i]
        }
        for (let i = 1; i < avgArr.length; i++) {
            avgArr[i - 1] = (avgArr[i] - avgArr[i - 1]) * 8 / this.size
        }
        this.ctx.beginPath()
        for (let i = 0; i < this.size; i++) {
            this.ctx.strokeStyle = 'rgba(' + parseInt(255 - arr[i]) + ',255,' + parseInt(255 - avg) + ',1)'
            r = 100 + arr[i] / 256 * ((this.height > this.width ? this.width : this.height) - 200) / 2
            this.ctx.moveTo(r, 0)
            this.ctx.arc(0, 0, r, 0, 2 * Math.PI, true)
        }
        this.ctx.stroke()
        r = 100
        this.ctx.beginPath()
        // this.ctx.fillStyle= "white";
        this.ctx.rotate(0.2 * Math.PI / this.size)
        for (let i = 0; i < this.size; i++) {
            this.ctx.fillStyle = 'rgba(' + parseInt(255 - avg) + ',' + parseInt(255 - arr[i]) + ',255,1)'
            this.ctx.rotate(2 * Math.PI / this.size)
            this.ctx.fillRect(r, 0, arr[i] / 2, 7)
        }
        this.ctx.stroke()

        const o = this.Dots[0]
        o.cap -= 0.004 * Math.PI
        for (let i = 0; i < 8; i++) {
            this.ctx.beginPath()
            this.ctx.lineWidth = 4
            this.ctx.strokeStyle = 'rgba(255,' + parseInt(255 - avg) + ',' + parseInt(255 - avgArr[i]) + ',1)'
            this.ctx.arc(0, 0, 90 - 10 * i, o.cap - avgArr[i] / 256 * 2 * Math.PI / 2, o.cap + avgArr[i] / 256 * 2 * Math.PI / 2, false)
            this.ctx.stroke()
        }
        // this.ctx.fillStyle= "white";

        this.ctx.translate(-this.width / 2, -this.height / 2)
    }
}
