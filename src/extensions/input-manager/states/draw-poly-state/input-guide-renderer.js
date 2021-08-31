import {InputSingle} from "./input-single.js";
import {InputContinue} from "./input-continue.js";
import {OperationTypes} from "./input-base.js";

export class InputGuideRenderer {
    get segmentType() {
        return this._program.drawing.segmentType;
    }

    get drawOperation() {
        return this._drawOperation;
    }

    set drawOperation(newValue) {
        this._drawOperation = newValue;
        this._input?.dispose();
        this._input = newValue == this._program.drawing.drawOperationOptions.CONTINUES ? new InputContinue(this._program) : new InputSingle(this._program);
    }

    constructor(program) {
        this._program = program;

        this._downFn = {
            [program.drawing.segmentTypeOptions.LINE]: pointDown,
            [program.drawing.segmentTypeOptions.CURVE]: curveDown
        }

        this._moveFn = {
            [program.drawing.segmentTypeOptions.LINE]: pointMove,
            [program.drawing.segmentTypeOptions.CURVE]: curveMove
        }

        this._upFn = {
            [program.drawing.segmentTypeOptions.LINE]: pointUp,
            [program.drawing.segmentTypeOptions.CURVE]: curveUp
        }

        this._input = new InputContinue(program);
        this._operations = [];
    }

    dispose() {
        this._downFn[this._program.drawing.segmentTypeOptions.LINE] = null;
        this._downFn[this._program.drawing.segmentTypeOptions.CURVE] = null;
        this._moveFn[this._program.drawing.segmentTypeOptions.LINE] = null;
        this._moveFn[this._program.drawing.segmentTypeOptions.CURVE] = null;
        this._upFn[this._program.drawing.segmentTypeOptions.LINE] = null;
        this._upFn[this._program.drawing.segmentTypeOptions.CURVE] = null;

        delete this._downFn;
        delete this._moveFn;
        delete this._upFn;
        delete this._program;
        delete this._startPoint;
        delete this._point;
    }

    async pointerDown(startPoint) {
        this._startPoint = startPoint;
        this._downFn[this.segmentType](this, startPoint);
    }

    async pointerMove(point) {
        this._point = point;
        this._moveFn[this.segmentType](this, point);
    }

    async pointerUp(point) {
        this._point = point;
        this._upFn[this.segmentType](this, point);
    }

    async clear() {
        this._operations.length = 0;
        await this._input.clearPoints();
    }
}

async function pointDown(guide, start) {
    await guide._input.pointDown(start, guide._operations, OperationTypes.LINE);
}

async function pointMove(guide, point) {
    await guide._input.pointMove(point, guide._operations, OperationTypes.LINE);
}

async function pointUp(guide, point) {
    await guide._input.pointUp(point, guide._operations, OperationTypes.LINE);
}

async function curveDown(guide, point) {

}

async function curveMove(guide, point) {
    console.log("curve move");
}

async function curveUp(guide, start) {
    console.log("curve up");
}
