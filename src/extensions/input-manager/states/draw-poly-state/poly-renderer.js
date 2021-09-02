import init, {fill, stroke} from "./../../../../../wasm/geometry/bin/geometry.js";

init();

export class PolyRenderer {
    static async render(program, operations) {
        let isPolygon = false;

        if (program.drawing.pen.type === program.drawing.penTypeOptions.POLYGON) {
            operations.push('z');
            isPolygon = true;
        }
        const cmd = operations.join(",");

        if (isPolygon === true && program.drawing.fill.enabled === true) {
            const points = fill(cmd);
            console.log("fill", points);
        }

        if (isPolygon === false || program.drawing.stroke.enabled === true) {
            const options = program.drawing.stroke.toSoldString();
            const lineWidth = program.drawing.stroke.lineWidth;
            const points = stroke(cmd, lineWidth, options);
            console.log("stroke", points);
        }
    }
}