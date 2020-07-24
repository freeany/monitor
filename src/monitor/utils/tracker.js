let host = 'cn-shanghai.log.aliyuncs.com' // 主机名
let project = 'lhrmonitor'
let logstoreName = 'lhrmonitorstore'
let userAgent = require('user-agent')
// 额外的数据， 一些公用的数据
function getExtraData () {
    return {
        // 用户id， 用户token等...
        title: document.title,
        url: location.url,
        timestemp: Date.now(),
        // userAgent: JSON.stringify(userAgent.parse(navigator.userAgent))
        userAgent: userAgent.parse(navigator.userAgent).name
    }
}
/* 
    一般会使用gif做图片上传，图片上传的速度快，而且没有跨域问题，但是有长度限制
*/
// 将日志发送到服务器 
class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logstoreName}/track`
        this.xhr = new XMLHttpRequest();
    }
    send (data = {}) {
        let extraData = getExtraData()
        let logs = { ...extraData, ...data }
        // 坑，对象的值不能是数字
        for (let key in logs) {
            if (typeof logs[key] === 'number') {
                logs[key] = "" + logs[key];
            }
        }
        // 这里规定， send的 数据的__log__的值是一个数组，数组中的值是对象，该对象中的每个值都必须是字符串，如果不是字符串将会报错
        // https://help.aliyun.com/document_detail/120218.html?spm=a2c4g.11186623.4.1.4aa15ad13kqlfz
        let body = JSON.stringify({
            __logs__: [JSON.parse(JSON.stringify(logs))]
        });
        this.xhr.open('POST', this.url, true)
        // let body = JSON.stringify(logs)
        this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");// 请求体类型
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0'); // 版本号
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);// 请求体大小
        this.xhr.onload = function () {
            // console.log('this.xhr.response', this.xhr.response)
        }
        this.xhr.onerror = function (error) {
            // console.log('error', error)
        }
        this.xhr.send(body)
    }
}

export default new SendTracker()
