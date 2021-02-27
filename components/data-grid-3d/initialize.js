import "./../orthographic-canvas/orthographic-canvas.js";
import {disableScroll, enableScroll} from "../lib/scroll.js";
import {disableMoveElements, enableMoveElements} from "../lib/move-element.js";
import {disableGrouping, enableGrouping} from "./data-grid-grouping.js";
import {disableColumnResize, enableColumnResize} from "./data-grid-columns-resize.js";

export async function initialize(parent, dropCallback) {
    await createScrollBox(parent);
    await createCanvas(parent);
    await enableGrouping(parent);
    await enableMoveElements(parent.querySelector(".grid-columns"), ".column-header", [".grid-grouping", ".grid-columns", ".column-header"],["field"], dropCallback);
    await enableMoveElements(parent.querySelector(".grid-grouping"), ".column-header-group", [".grid-grouping", ".column-header-group"], ["field"], dropCallback);
    await enableColumnResize(parent, parent.minColumnWidth);
}

export async function dispose(parent) {
    await disposeScrollBox(parent);
    await disposeCanvas(parent);
    await disableGrouping(parent);
    await disableMoveElements(parent.querySelector(".grid-columns"));
    await disableColumnResize(parent);
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