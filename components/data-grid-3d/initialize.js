import "./../orthographic-canvas/orthographic-canvas.js";
import {disableScroll, enableScroll} from "../lib/scroll.js";
import {disableMoveElements, enableMoveElements} from "../lib/move-element.js";

export async function initialize(parent, dropCallback) {
    await createScrollBox(parent);
    await createCanvas(parent);
    await enableMoveElements(parent.querySelector(".grid-columns"), ".column-header", [".column-header", ".grid-grouping", ".grid-columns"], dropCallback);
}

export async function dispose(parent) {
    await disposeScrollBox(parent);
    await disposeCanvas(parent);
    await disableMoveElements(parent.querySelector(".grid-columns"));
}

async function createScrollBox(parent) {
    const scroll =  parent.querySelector(".scroll");
    const marker = parent.querySelector(".scroll-marker");

    parent.scroller = scroll;
    parent.marker = marker;

    enableScroll(scroll, parent.scrollHandler, 1);
}

async function disposeScrollBox(parent) {
    disableScroll(parent);

    parent.scroll.parentElement.removeChild(parent.scroll);
    parent.marker.parentElement.removeChild(parent.marker);

    parent.scroller = null;
    parent.marker = null;
}

async function createCanvas(parent) {
    const canvas = parent.querySelector("orthographic-canvas");

    parent.canvas = canvas;

    function ready() {
        parent.ready();
        parent._isReady = true;
        canvas.removeEventListener("ready", ready);
    }

    canvas.addEventListener("ready", ready);
}

async function disposeCanvas(parent) {
    parent.canvas = null;
}