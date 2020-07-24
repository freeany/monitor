function getSelectors (path) {
    return path.reverse().filter(element => {
        return element !== document && element !== window
    }).map(element => {
        let selector = ''
        if (element.id) {
            return `${element.nodeName.toLowerCase()}#${element.id}`
        } else if (element.className && typeof element.className === 'string') {
            return `${element.nodeName.toLowerCase()}.${element.className}`
        } else {
            selector = element.nodeName.toLowerCase()
        }
        return selector
    }).join(' ')
}

export default function (pathOrTarget) {
    if (Array.isArray(pathOrTarget)) { // jsErro或promiseError的时候会是一个数组
        return getSelectors(pathOrTarget)
    } else { // 在资源加载错误的时候会是一个对象
        let path = []
        // 将该资源的 及其所有父元素 push到一个数组中。
        while (pathOrTarget) {
            path.push(pathOrTarget)
            pathOrTarget = pathOrTarget.parentNode
        }
        return getSelectors(path)
    }
}
