let host = 'cn-shanghai.log.aliyuncs.com' // 主机名
let project = 'lhr-monitor'
let logstoreName = 'lhr-monitor-store'
let userAgent = require('user-agent')
function getExtraData() {
    return {
        // 用户id， 用户token等...
        title: document.title,
        url: location.url,
        timestemp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent)
    }
}

// 将日志发送到服务器 
class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logstoreName}/track`
        this.xhr = new XMLHttpRequest
    }
    send(data = {}) {
        let extraData = getExtraData()
        let log = {...extraData, ...data}
        // 坑，对象的值不能是数字
        for(let key in log) {
            if(typeof log[key] === 'number') {
                log[key] = `${log[key]}`
            }
        }
        console.log(log)
        this.xhr.open('POST', this.url, true)
        let body = JSON.stringify(log)
        this.xhr.setRequestHeader('Content-Type','application/json')  // 请求体类型
        this.xhr.setRequestHeader('x-log-apiversion','0.6.0') // 版本号
        this.xhr.setRequestHeader('x-log-bodyrawsize',body.length) // 请求体大小
        this.xhr.onload = function () {
            // console.log('this.xhr.response', this.xhr.response)
        }
        this.xhr.onerror = function(error) {
            // console.log('error', error)
        }
        this.xhr.send()
    }
}

export default new SendTracker()