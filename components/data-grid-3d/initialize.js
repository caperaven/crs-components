import "./../orthographic-canvas/orthographic-canvas.js";
import {disableMoveElements, enableMoveElements} from "./grid-move-element.js";
import {disableGrouping, enableGrouping} from "./data-grid-grouping.js";
import {disableColumnResize, enableColumnResize} from "./data-grid-columns-resize.js";
import {enableOrthographicResponder, disableOrthographicResponder} from "./../../extensions/orthographic-canvas/orthographic-scroll-responder.js";
import {enableRowRendering, disableRowRendering} from "./data-grid-row-rendering.js";
import {enableVirtualization, disableVirtualization} from "./data-grid-virtualize.js";

export async function initialize(parent) {
    await createCanvas(parent);
    await enableRowRendering(parent);
    await enableGrouping(parent);
    await enableMoveElements(parent);
    await enableColumnResize(parent, parent.minColumnWidth);
    await enableOrthographicResponder(parent);
    await enableVirtualization(parent);
}

export async function dispose(parent) {
    await disposeCanvas(parent);
    await disableRowRendering(parent);
    await disableGrouping(parent);
    await disableMoveElements(parent);
    await disableColumnResize(parent);
    await disableOrthographicResponder(parent);
    await disableVirtualization(parent);
}

async function createCanvas(parent) {
    const canvas = parent.querySelector("orthographic-canvas");
    parent.canvas = canvas;

    function ready() {
        parent.ready();
        parent._isReady = true;
        canvas.removeEventListener("ready", ready);
        canvas.zeroTopLeft();
    }

    canvas.addEventListener("ready", ready);
}

async function disposeCanvas(parent) {
    parent.canvas = null;
}