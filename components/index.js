import {createCanvas, clearCanvas} from "./canvas-utils/canvas.js";

globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
globalThis.crs = globalThis.crs || {};
globalThis.crs.canvas = {
    create: createCanvas,
    clear: clearCanvas
}