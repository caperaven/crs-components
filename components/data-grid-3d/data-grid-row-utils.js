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
        `const ctx = crs.canvas.create(${args.rowWidth}, ${args.rowHeight}, "#ffffff");`,
        `ctx.fillStyle = "white";`,
        `ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);`,
        `ctx.fillStyle = "#000000";`,
        `ctx.font = "16px serif";`
    ];
    let offsetX = 0;
    for (let column of args.columnsDef) {
        const field = column["field"];
        const width = Number(column["width"] || args.defaultWidth);

        code.push(`context["${field}"] && ctx.fillText(context["${field}"],${offsetX + args.padding}, ${args.textHeight + args.padding});`)

        offsetX += width;
    }
    code.push("return ctx");
    return new AsyncFunction("context", code.join("\n"));
}

export function calculateRowWidth(columns) {
    let rowWidth = 0;
    for (let column of columns) {
        rowWidth += Number(column.width);
    }
    return rowWidth;
}

export async function createRowItem(width, height, ctx) {
    const geometry = new PlaneGeometry(width, height);
    const texture = new CanvasTexture(ctx.canvas);
    const material = new MeshBasicMaterial({map: texture});
    return new Mesh(geometry, material);
}