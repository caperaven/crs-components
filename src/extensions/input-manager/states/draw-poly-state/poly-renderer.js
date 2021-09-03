import init, {fill, stroke} from "./../../../../../wasm/geometry/bin/geometry.js";
import {MaterialType} from "./../../../../gfx-helpers/materials.js";
import {rawToGeometry} from "./../../../../gfx-helpers/raw-to-geometry.js";
import CurveGeometryProvider from "./../../../../gfx-providers/providers/geometry/curve-geometry-provider.js";

init();

// todo: JHR: make single export function
export class PolyRenderer {
    static async render(program, operations) {
        let isPolygon = false;

        if (program.drawing.pen.type === program.drawing.penTypeOptions.POLYGON) {
            operations.push('z');
            isPolygon = true;
        }
        const cmd = operations.join(",");

        const group = await crs.createThreeObject("Group");

        if (isPolygon === true && program.drawing.fill.enabled === true) {
            const points = fill(cmd);
            await createFill(program, points, group);
        }

        if (isPolygon === false || program.drawing.stroke.enabled === true) {
            if (program.drawing.stroke.type === program.drawing.strokeTypeOptions.DOTTED) {
                const color = program.drawing.stroke.color;
                await program.materials.get(MaterialType.BASIC, color);
                const dotted = program.drawing.stroke.dotted;
                const provider = new CurveGeometryProvider();
                const mesh = await provider.processItem({
                    material: color,
                    args: {
                        data: cmd,
                        icon: dotted.icon,
                        transform: `s,${dotted.xScale},${dotted.yScale},1`,
                        gap: dotted.gap,
                        rotation: dotted.rotation
                    }
                }, program);
                mesh.position.z = 1;
                group.add(mesh);
                await provider.dispose();
            }
            else {
                const options = program.drawing.stroke.toSoldString();
                const lineWidth = program.drawing.stroke.lineWidth;
                const points = stroke(cmd, lineWidth, options);
                await createStroke(program, points, group);
            }
        }

        program.canvas.scene.add(group);
    }
}

async function createFill(program, fillData, group) {
    const color = program.drawing.fill.color;
    const material = await program.materials.get(MaterialType.BASIC, color);
    material.side = await crs.getThreeConstant("DoubleSide");

    const polygon = await rawToGeometry(fillData, material);
    polygon.name = "fill-polygon";
    group.add(polygon);
}

async function createStroke(program, strokeData, group) {
    const color = program.drawing.stroke.color;
    const material = await program.materials.get(MaterialType.BASIC, color);
    material.side = await crs.getThreeConstant("DoubleSide");

    const polygon = await rawToGeometry(strokeData, material);
    polygon.name = "stroke-polygon";
    polygon.position.z = 1;

    group.add(polygon);
}