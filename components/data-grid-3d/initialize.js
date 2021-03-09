import "./../orthographic-canvas/orthographic-canvas.js";
import {disableMoveElements, enableMoveElements} from "./_move-element.js";
import {disableGrouping, enableGrouping} from "./_grouping.js";
import {disableColumnResize, enableColumnResize} from "./_columns-resize.js";
import {enableOrthographicResponder, disableOrthographicResponder} from "./../../extensions/orthographic-canvas/orthographic-scroll-responder.js";
import {enableRowRendering, disableRowRendering} from "./_row-rendering.js";
import {enableVirtualization, disableVirtualization} from "./_virtualize.js";
import {enableRowFactory, disableRowFactory} from "./_row-factory.js";

export async function initialize(parent) {
    await createCanvas(parent);
    await enableVirtualization(parent);
    await enableRowFactory(parent);
    await enableRowRendering(parent);
    await enableGrouping(parent);
    await enableMoveElements(parent);
    await enableColumnResize(parent, parent._rowFactory.dimensions.minWidth);
    await enableOrthographicResponder(parent, Math.round(parent.canvas.height / 2));

    parent._isReady = true;
    parent.ready();
    parent.canvas.zeroTopLeft();
}

export async function dispose(parent) {
    await disposeCanvas(parent);
    await disableVirtualization(parent);
    await disableRowFactory(parent);
    await disableRowRendering(parent);
    await disableGrouping(parent);
    await disableMoveElements(parent);
    await disableColumnResize(parent);
    await disableOrthographicResponder(parent);
}

async function createCanvas(parent) {
    return new Promise(resolve => {
        const canvas = parent.querySelector("orthographic-canvas");
        parent.canvas = canvas;

        function initializeReady() {
            canvas.removeEventListener("ready", initializeReady);
            resolve();
        }

        canvas.addEventListener("ready", initializeReady);
    })
}

async function disposeCanvas(parent) {
    parent.canvas = null;
}