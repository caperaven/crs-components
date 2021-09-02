import {InputBase, OperationTypes} from "./input-base.js";

export class InputContinue extends InputBase {
    async pointDown(start, operations, operationType) {
        this._start = start;
        await this._createPoint(start, this.pointColor, "control-point", true);

        if (operations.length == 0) {
            await this.moveTo(this._start, operations);
        }

        await this.lineTo(start, operations);
    }

    async pointMove(point, operations, operationType) {
        this.p2 = this.shape;
        await this.updateLineTo(point, operations);

        if (operationType == OperationTypes.LINE) {
            return await this.moveLine(point, operations);
        }

        if (operationType == OperationTypes.CURVE) {
            return await this.moveCurve(point, operations);
        }
    }

    async pointUp(point, operations, operationType, cp) {
        delete this.p2;
        delete this._start;

        if (this.cp != null) {
            this._program.canvas.remove(this.cp);
        }

        delete this.cp;
        delete this._point;
        delete this._start;
    }
}