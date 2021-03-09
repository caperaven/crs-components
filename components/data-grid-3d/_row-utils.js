import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {CanvasTexture} from "/node_modules/three/src/textures/CanvasTexture.js";
import {Color} from "/node_modules/three/src/math/Color.js";

/**
 * This function creates a utility function to render rows based on the column definitions.
 * @param columnsDef
 * @returns function
 */
export async function generateRowRenderer(args) {
    const code = [
        `ctx.fillStyle = "white";`,
        `ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);`,
        `ctx.fillStyle = "#000000";`,
    ];

    const lineCode = [
        'ctx.lineWidth = 1;',
        'ctx.strokeStyle = "#c0c0c0"',
    ];

    let offsetX = 0;
    for (let column of args.columnsDef) {
        const field = column["field"];
        let width = Number(column["width"]);
        if (width < args.minWidth) {
            width = args.minWidth;
        }

        const maxWidth = width - (args.padding * 2);

        code.push(`context["${field}"] && ctx.fillText(context["${field}"],${offsetX + args.padding}, ${args.textHeight + args.padding}, ${maxWidth});`);

        // draw the line from top to bottom after the field text
        lineCode.push('ctx.beginPath();');
        lineCode.push(`ctx.moveTo(${offsetX + width}, 0);`);
        lineCode.push(`ctx.lineTo(${offsetX + width}, ${args.rowHeight});`);
        lineCode.push('ctx.stroke();')

        offsetX += width;
    }
    return new AsyncFunction("context", "ctx", [...code, ...lineCode].join("\n"));
}

export function calculateRowWidth(columns, minWidth) {
    let rowWidth = 0;
    for (let column of columns) {
        let width = Number(column.width);
        if (width < minWidth) {
            width = minWidth;
        }
        rowWidth += width;
    }
    return rowWidth;
}

export async function createRowItem(ctx) {
    const geometry = new PlaneGeometry(1, 1);
    const texture = new CanvasTexture(ctx.canvas);
    const material = new MeshBasicMaterial({map: texture});
    const result = new Mesh(geometry, material);
    result.scale.set(ctx.canvas.width, ctx.canvas.height, 1);
    result.__ctx = ctx;
    result.__type = "data-row";
    return result;
}