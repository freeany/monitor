let lastEvent;
['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
    document.addEventListener(eventType, event => {
        lastEvent = event
    },{
        capture: true, // 捕获阶段执行
        passive: true // 默认不阻止默认事件，防止一直询问，导致事件卡顿
    })
})

export default function() {
    return lastEvent
}