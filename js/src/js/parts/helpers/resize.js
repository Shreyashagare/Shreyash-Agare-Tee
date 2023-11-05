export const onResizeAndOrientation = (cb, resizeCb) => {
    const mql = window.matchMedia("(orientation: portrait)");
    if (mql ? .addEventListener) {
        mql.addEventListener('change', cb);
    } else {
        mql.addListener(cb)
    }

    if (!resizeCb) return
    window.addEventListener('resize', resizeCb, false)
}