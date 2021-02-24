import {enableScroll, disableScroll} from "./../lib/scroll.js"

export function createScrollBox(parent) {
    const scroll =  document.createElement("div");
    scroll.style.position = "absolute";
    scroll.style.top = "0";
    scroll.style.left = "0";
    scroll.style.width = "100%";
    scroll.style.height = "100%";
    scroll.style.overflow = "auto";

    const marker = document.createElement("div");
    marker.style.position = "absolute";
    marker.style.width = "1px";
    marker.style.height = "1px";

    scroll.appendChild(marker);
    parent.appendChild(scroll);

    parent.scroller = scroll;
    parent.marker = marker;

    enableScroll(scroll, parent.scrollHandler, 1);
}

export function disposeScrollBox(parent) {
    disableScroll(parent);
}