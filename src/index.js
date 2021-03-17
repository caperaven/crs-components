import {createCanvas, createCanvasForTexture, clearCanvas, resizeCanvas} from "./components/canvas-utils/canvas.js";

globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
globalThis.crs = globalThis.crs || {};
globalThis.crs.canvas = {
    create: createCanvas,
    createCanvasForTexture: createCanvasForTexture,
    clear: clearCanvas,
    resizeCanvas: resizeCanvas
}

