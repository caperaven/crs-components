import {InputBase} from "./input-base.js";

export class InputSingle extends InputBase {
    async pointDown(start, operations, operationType) {
        this.p1 = await this._createPoint(start, this.pointColor, "control-point", true);
        this.p2 = await this._createPoint(start, this.pointColor, "control-point", true);

        await this.moveTo(start, operations);
        await this.lineTo(start, operations);
    }

    async pointMove(point, operations, operationType) {
        this.p2.position.set(point.x, point.y, 0);
        await this.updateLineTo(point, operations);
    }

    async pointUp(point, operations, operationType) {
        await this.clearPoints();
        delete this.p1;
        delete this.p2;
        await this._program.canvas._inputManager._states.currentState.closePath();
    }
}