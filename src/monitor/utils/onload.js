export default function (callback) {
    if (document.readyState === 'complete') {
        console.log('complete callback')
        callback && callback()
    } else {
        // console.log('load callback')
        window.addEventListener('load', callback)
    }
}
