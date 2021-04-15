import {createCanvas, createCanvasForTexture, clearCanvas, resizeCanvas} from "./lib/canvas-utils/canvas.js";

globalThis.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
globalThis.crs = globalThis.crs || {};
globalThis.crs.canvas = {
    create: createCanvas,
    createCanvasForTexture: createCanvasForTexture,
    clear: clearCanvas,
    resizeCanvas: resizeCanvas
}

export async function loadModules() {
    globalThis.crs.components = {
        url: import.meta.url.replace("index.js", "").replace(window.location.origin, "")
    }

    const url = globalThis.crs.components.url; // /node_modules/crs-components/

    // Components
    await crs.modules.add("monaco-editor", `${url}components/monaco-editor/monaco-editor.js`);
    await crs.modules.add("html-to-text", `${url}components/html-to-text/html-to-text.js`);
    await crs.modules.add("ordered-list", `${url}components/lists/ordered-list.js`);
    await crs.modules.add("unordered-list", `${url}components/lists/unordered-list.js`);
    await crs.modules.add("overflow-toolbar", `${url}components/toolbars/overflow-toolbar.js`);
    await crs.modules.add("standard-toolbar", `${url}components/toolbars/standard-toolbar.js`);

    // GFX Components
    await crs.modules.add("orthographic-canvas", `${url}gfx-components/orthographic-canvas/orthographic-canvas.js`);
    await crs.modules.add("perspective-canvas", `${url}gfx-components/perspective-canvas/perspective-canvas.js`);
    await crs.modules.add("graphics-parser", `${url}gfx-providers/graphics-parser.js`);

    // Extensions
    await crs.modules.add("orthographic-draggable", `${url}extensions/orthographic-canvas/orthographic-draggable.js`);
}