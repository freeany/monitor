// 监控js错误
// 导出一个脚本函数
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import SendTracker from '../utils/tracker'
export function injectJsError () {
    // 监听全局未捕获的错误
    window.addEventListener('error', function (event) {
        let lastEvent = getLastEvent() // 最后一个交互事件
        // console.log(lastEvent)
        // event 错误事件对象之一
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
    })

    function getLines (stack) {
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, '')).join('^')
    }
}
