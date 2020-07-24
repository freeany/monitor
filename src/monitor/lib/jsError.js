// 监控js错误
// 导出一个脚本函数
// 埋点就是在特定的 情境下向服务端发送一些数据
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import SendTracker from '../utils/tracker'
export function injectJsError () {
    // 监听全局未捕获的错误
    window.addEventListener('error', function (event) {
        console.log('发现错误')
        let lastEvent = getLastEvent() // 最后一个交互事件
        // console.log(lastEvent)
        // event 错误事件对象
        // 这里是资源加载错误
        if(event.target && (event.target.src || event.target.href)) {
            let log = {
                kind: 'stability', // 监控指标的大类
                type: 'error', // 小类型，这是一个错误
                errorType: 'resourceError', // js或css加载错误
                filename: event.target.src || event.target.href, // 哪个文件报错了
                tagName: event.target.tagName,
                selector: getSelector(event.target) // 代表最后一个操作的元素
            }
            SendTracker.send(log)
        } else {
            // 这是js错误
            let log = {
                kind: 'stability', // 监控指标的大类
                type: 'error', // 小类型，这是一个错误
                errorType: 'jsError', // js执行错误
                url: '', // 访问哪个路径 报错了
                message: event.message, // 报错信息
                filename: event.filename, // 哪个文件报错了
                position: `${event.lineno}: ${event.colno}`,
                stack: getLines(event.error.stack),
                selector: lastEvent ? getSelector(lastEvent.path) : '' // 代表最后一个操作的元素
            }
            SendTracker.send(log)
        }
    }, true)

    // 监听全局未被捕获的promise错误
    // 与 error事件不同的是，即使是向服务端发送的是同一种数据结构数据，但是这些数据取出的方式是不同的，unhandledrejection事件中的event对象并没有该数据结构中的一些数据,需要从reason进行提取
    window.addEventListener('unhandledrejection', event => {
        // console.log(event)
        let lastEvent = getLastEvent() 
        let message
        let filename
        let line = 0
        let column = 0
        let stack = ''
        // 很多数据都是从event.reason中进行获得的
        let reason = event.reason
        if(typeof reason === 'string') {
            // reject出的异常
            message = reason
        } else if(typeof reason === 'object'){
            message = reason.message
            // 没有reject，但是抛出异常了，在Promise中的回调函数中出现错误, 但是没有被捕获
            if(reason.stack) {
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
                filename = matchResult[1]
                line = matchResult[2]
                column = matchResult[3]
            }
            stack = getLines(reason.stack)
        }
        let log = {
            kind: 'stability', // 监控指标的大类
            type: 'error', // 小类型，这是一个错误
            errorType: 'promiseError', // js执行错误
            message, // 报错信息
            filename, // 哪个文件报错了
            position: `${line}: ${column}`,
            stack,
            selector: lastEvent ? getSelector(lastEvent.path) : '' // 代表最后一个操作的元素
        }
        SendTracker.send(log)
    })

    function getLines (stack) {
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, '')).join('^')
    }
}
