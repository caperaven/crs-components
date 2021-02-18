export function enableScroll(element, callback, timeout) {
    const scrollObject = {
        lastTop: 0,
        top: 0,
        lastLeft: 0,
        left: 0,
        lastTime: 0,
        callback: callback,
        timeout: timeout
    }

    scrollObject.scrollFn = scroll.bind(scrollObject);

    element.__scroll = scrollObject;
    element.addEventListener("scroll", scrollObject.scrollFn);
}

export function disableScroll(element) {
    element.removeEventListener("scroll", element.__scroll.scrollFn);
    delete element.__scroll.scrollFn;
    delete element.__scroll.callback;
    delete element.__scroll;
}

function scrolling() {
    if (this.lastTop === this.top && this.lastLeft === this.left) return;

    requestAnimationFrame(async (timing) => {
        this.lastTop = this.top;
        this.lastLeft = this.left;

        if (timing - this.lastTime > this.timeout) {
            this.lastTime = timing;
            this.callback({top: this.top, left: this.left});
        }
        scrolling.call(this)
    });
}

async function scroll(event) {
    this.top = event.target.scrollTop;
    this.left = event.target.scrollLeft;
    scrolling.call(event.target.__scroll);
}