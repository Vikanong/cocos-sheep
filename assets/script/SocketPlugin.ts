class SocketPlugin {
    constructor(param) {
        this.websocket = null
        this.isConnect = false
        this.timeoutNum = null
        this.isActivelyClose = false
        this.param = param
    }

    connect() {
        this.websocket = new WebSocket(this.param.url)
        this.initSocket(this.param)
    }


    initSocket(param) {
        this.isActivelyClose = false

        this.websocket.onclose = e => {
            console.log('websocket 连接关闭~')
            this.isConnect = false
            // 如果手动关闭则不进行重连
            if (!this.isActivelyClose) {
                this.reconnectSocket(param)
            }
        }

        this.websocket.onerror = e => {
            console.log('websocket 发生异常~' + e)
            if (!this.isActivelyClose) {
                this.reconnectSocket(param)
            }
        }

        this.websocket.onopen = () => {
            console.log('websocket 已连接~ ')
            this.isConnect = true
            if (param.hasOwnProperty('msg')) {
                this.send(param.msg || '')
            }
        }

        this.websocket.onmessage = e => {
            param.callback(JSON.parse(e.data))
        }
    }

    reconnectSocket(param) {
        if (this.isConnect === true) {
            return false
        }
        console.log('websocket 重新连接~ ')
        this.isConnect = true
        this.timeoutNum && clearTimeout(this.timeoutNum)
        this.timeoutNum = setTimeout(() => {
            this.connect(param)
            this.isConnect = false
        }, param.heartbeat)
    }

    /**
     * websocket连接状态下才能进行send
     * @param {*} msg
     * 向服务send的消息
     */
    send(msg) {
        this.websocket.send(JSON.stringify(msg))
    }

    close() {
        this.isActivelyClose = true;
        if (this.websocket) {
            this.websocket.close()
        }
    }
}

export default SocketPlugin