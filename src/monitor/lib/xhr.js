import tracker from '../utils/tracker'

// 拦截或者说是增强 xhr
export function injectXHR() {
    let XMLHttpRequest = window.XMLHttpRequest
    let oldOpen = XMLHttpRequest.prototype.open
    // 方法名， url地址，是否异步
    XMLHttpRequest.prototype.open = function (method, url, async) {
        if(!url.match(/logstores/) && !url.match(/sockjs-node/)) {
            this.logData = { method, url, async }
        }
        
        return oldOpen.apply(this, arguments)
    }

    let oldSend = XMLHttpRequest.prototype.send
    // body 请求体
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            let startTime = Date.now()
            let handler = type => event => {
                let duration = Date.now() - startTime
                let status = this.status
                let statusText = this.statusText
                tracker.send({
                    kind: 'stability',
                    type: 'xhr',
                    eventType: type, // load error abort
                    pathname: this.logData.url, // 请求路径
                    status: status + '_' + statusText, // 状态码
                    duration, // 持续事件
                    response: this.response ? JSON.stringify(this.response) : '', // 响应体
                    params: body || ''
                })
            }

            this.addEventListener('load', handler('load'), false)
            this.addEventListener('error', handler('error'), false)
            this.addEventListener('abort', handler('abort'), false)
        }
        return oldSend.apply(this, arguments)
    }
}