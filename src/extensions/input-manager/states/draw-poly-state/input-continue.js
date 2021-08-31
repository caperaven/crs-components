import {InputBase} from "./input-base.js";

export class InputContinue extends InputBase {
    async pointDown(start, operations, operationType) {
        this._start = start;
        await this._createPoint(start, this.pointColor, "control-point", true);

        if (operations.length == 0) {
            await this.moveTo(this._start, operations);
        }
    }

    async pointMove(point, operations, operationType) {
        this.shape.position.set(point.x, point.y, 0);

        if (this.points.length == 1) return;

        if (this.operation != true) {
            this.operation = true
            await this.lineTo(point, operations);
        }
        else {
            await this.updateLineTo(point, operations);
        }
    }

    async pointUp(point, operations, operationType, cp) {
        this.operation = false;
        delete this._start;
    }
}