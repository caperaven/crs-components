import {InputBase} from "./input-base.js";
import {OperationTypes} from "./input-base.js";

export class InputSingle extends InputBase {
    async pointDown(start, operations, operationType) {
        this._start = start;

        this.p1 = await this._createPoint(start, this.pointColor, "control-point", true);
        this.p2 = await this._createPoint(start, this.pointColor, "control-point", true);

        await this.moveTo(start, operations);
        await this.lineTo(start, operations);
    }

    async pointMove(point, operations, operationType) {
        if (operationType == OperationTypes.LINE) {
            return await this.moveLine(point, operations);
        }

        if (operationType == OperationTypes.CURVE) {
            return await this.moveCurve(point, operations);
        }
    }

    async pointUp(point, operations, operationType) {
        await this.clearPoints();

        if (this.cp != null) {
            this._program.canvas.remove(this.cp);
        }

        delete this.p1;
        delete this.p2;
        delete this.cp;
        delete this._point;
        delete this._start;
        await this._program.canvas._inputManager._states.currentState.closePath();
    }
}