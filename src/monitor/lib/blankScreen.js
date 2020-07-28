import tracker from '../utils/tracker'
import onload from '../utils/onload'

export function blankScreen () {
    let wrapperElements = ['html', 'body', '#container', '.content.main']
    let emptyPoints = 0
    function getSelector (element) {
        if (element.id) {
            return '#' + element.id
        } else if (element.className) {
            // 如果有多个类名的话 a b c , 变成 .a.b.c
            const result = element.className.split(' ').filter(item => !!item).join('.')
            return '.' + result
        } else {
            return element.nodeName.toLowerCase()
        }
    }
    // 传递的参数中是否包含元素
    function isWrapper (element) {
        let selector = getSelector(element)
        if (wrapperElements.indexOf(selector) !== -1) {
            // 看空白的节点个数
            emptyPoints++
        }
    }
    onload(function () {
        for (let i = 1; i <= 9; i++) {
            const a = window.innerWidth * i / 10
            const b = window.innerHeight / 2
            const c = window.innerWidth / 2
            const d = window.innerHeight * i / 10
            let xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)

            let yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)
            // isWrapper(xElements[0])
            // isWrapper(yElements[0])
            isWrapper(xElements[0])
            isWrapper(yElements[0])

        }

        // 打印 空白点的个数
        console.log(emptyPoints, '空白点个数')

        // 如果空白的点数大于16个点的话，则可以认为是白屏了
        if (emptyPoints > 10000) {
            // 取中间点
            let centerElement = document.elementsFromPoint(
                window.innerWidth / 2,
                window.innerHeight / 2
            )
            tracker.send({
                kind: 'stability',
                type: 'blank',
                emptyPoints,
                sreen: window.screen.width + 'X' + window.screen.height,
                viewPoint: window.innerWidth + 'X' + window.innerHeight,
                selector: getSelector(centerElement[0])
            })
        }
    })

}
