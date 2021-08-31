import {createNormalizedPlane} from "../../../../threejs-helpers/shape-factory.js";
import {MaterialType} from "../../../../gfx-helpers/materials.js";

export const OperationTypes = Object.freeze({
    LINE: "line",
    CURVE: "curve"
})

export class InputBase {
    constructor(program) {
        this._program = program;
        this.points = [];
        this.pointColor = "#000090";
    }

    dispose() {
        this.points.length = 0;
        delete this._program;
    }

    async _createPoint(startPoint, color, name, addToPoints = true) {
        color = color || "#000000";
        const material = await this._program.materials.get(MaterialType.BASIC, color);
        this.shape = await createNormalizedPlane(10, 10, material, "rect");
        this.shape.name = name || "path-point";
        this.shape.type = "point";
        this.shape.position.set(startPoint.x, startPoint.y, 1);
        this._program.canvas.scene.add(this.shape);

        if (addToPoints === true) {
            this.points.push(this.shape);
        }

        return this.shape;
    }

    async pointUp(point, operations, operationType) {
        return;
    }

    async clearPoints() {
        for (let point of this.points) {
            this._program.canvas.scene.remove(point);
        }
    }

    async moveTo(point, operations) {
        operations.push(`m,${point.x.toFixed(2)},${point.y.toFixed(2)},0`);
    }

    async lineTo(point, operations) {
        operations.push(`l,${point.x.toFixed(2)},${point.y.toFixed(2)},0`);
    }

    async updateLineTo(point, operations) {
        operations[operations.length - 1] = `l,${point.x.toFixed(2)},${point.y.toFixed(2)},0`;
    }

    async curveTo(cp, point, operations) {
        operations.push(`c,${cp.x.toFixed(2)},${cp.y.toFixed(2)},0,${point.x.toFixed(2)},${point.y.toFixed(2)},0`);
    }
}