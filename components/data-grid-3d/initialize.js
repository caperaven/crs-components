import "./../orthographic-canvas/orthographic-canvas.js";
import {disableScroll, enableScroll} from "../lib/scroll.js";
import {disableMoveElements, enableMoveElements} from "./grid-move-element.js";
import {disableGrouping, enableGrouping} from "./data-grid-grouping.js";
import {disableColumnResize, enableColumnResize} from "./data-grid-columns-resize.js";

export async function initialize(parent) {
    await createScrollBox(parent);
    await createCanvas(parent);
    await enableGrouping(parent);

    await enableMoveElements({
        grid: parent,
        container: parent.querySelector(".grid-columns"),
        movableQuery: ".column-header",
        dropQueries: [".grid-grouping", ".grid-columns", ".column-header"],
        copyPlaceholderProperties: {"field": "field"},
    });

    await enableMoveElements({
        grid: parent,
        container: parent.querySelector(".grid-grouping"),
        movableQuery: ".column-header-group",
        dropQueries: [".grid-grouping", ".column-header-group"],
        copyPlaceholderProperties: {"field": "field", "drop": "reorderGrouping"},
    });

    await enableColumnResize(parent, parent.minColumnWidth);
}

export async function dispose(parent) {
    await disposeScrollBox(parent);
    await disposeCanvas(parent);
    await disableGrouping(parent);
    await disableMoveElements(parent.querySelector(".grid-columns"));
    await disableMoveElements(parent.querySelector(".grid-grouping"));
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