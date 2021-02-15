export function enableScroll(element, callback) {
    const scrollObject = {
        lastTop: 0,
        top: 0,
        lastTime: 0,
        callback: callback,
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
    if (this.lastTop === this.top) return;

    requestAnimationFrame(async (timing) => {
        this.lastTop = this.top;

        if (timing - this.lastTime > 100) {
            this.lastTime = timing;
            await this.callback();
        }
        scrolling.call(this)
    });
}

async function scroll(event) {
    this.top = event.target.scrollTop;
    scrolling.call(event.target.__scroll);
}