import {InputSingle} from "./input-single.js";
import {InputContinue} from "./input-continue.js";
import {OperationTypes} from "./input-base.js";
import {MaterialType} from "./../../../../gfx-helpers/materials.js";
import init, {pattern} from "./../../../../../wasm/geometry/bin/geometry.js";

init();

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

    get scene() {
        return this._program.canvas.scene;
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

    static async new(program) {
        const guide = new InputGuideRenderer(program);
        this.color = "#ff0090";

        guide.instanceMaterial  = await program.materials.get(MaterialType.INSTANCE, this.color);
        guide.material          = await program.materials.get(MaterialType.BASIC, this.color);
        guide.dummy             = await crs.createThreeObject("Object3D");
        guide.axis              = await crs.createThreeObject("Vector3");
        guide.up                = await crs.createThreeObject("Vector3", 0, 1, 0 );

        await guide._rebuildInstanceMesh(100);

        return guide;
    }

    async _rebuildInstanceMesh(count) {
        this.maxCount = count;

        if (this.mesh != null) {
            this.scene.remove(this.mesh);
            this.mesh.dispose();
        }

        const InstancedMesh     = await crs.getThreePrototype("InstancedMesh");
        const PlaneGeometry     = await crs.getThreePrototype("PlaneGeometry");
        const DynamicDrawUsage  = await crs.getThreeConstant("DynamicDrawUsage");

        this.mesh = new InstancedMesh(new PlaneGeometry(), this.instanceMaterial, count);
        this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
        this.mesh.name = name;
        this.mesh.instanceMatrix.needsUpdate = true;
        this.scene.add(this.mesh);
    }

    dispose() {
        this._downFn[this._program.drawing.segmentTypeOptions.LINE] = null;
        this._downFn[this._program.drawing.segmentTypeOptions.CURVE] = null;
        this._moveFn[this._program.drawing.segmentTypeOptions.LINE] = null;
        this._moveFn[this._program.drawing.segmentTypeOptions.CURVE] = null;
        this._upFn[this._program.drawing.segmentTypeOptions.LINE] = null;
        this._upFn[this._program.drawing.segmentTypeOptions.CURVE] = null;

        this._program.canvas.scene.remove(this.mesh);

        this.material.dispose();
        this.instanceMaterial.dispose();
        this.mesh.dispose();

        delete this.material;
        delete this.instanceMaterial;
        delete this.geometry;
        delete this.mesh;
        delete this.dummy;
        delete this.axis;
        delete this.up;

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

    async draw(pointData) {
        for (let i = 0; i < this.maxCount; i++) {
            if (i < pointData.length - 1) {
                let item = pointData[i];
                const tangent = await createVector([item.tx, item.ty, 0], -1);
                this.axis.crossVectors(this.up, tangent).normalize();
                this.dummy.quaternion.setFromAxisAngle(this.axis, item.radians);

                this.dummy.position.x = item.px;
                this.dummy.position.y = item.py;
                this.dummy.scale.set(5, 5, 1);
                this.dummy.updateMatrix();

                this.mesh.setMatrixAt(i, this.dummy.matrix);
            }
            else {
                this.dummy.visibility = false;
                this.mesh.setMatrixAt(i, this.dummy.matrix);
            }
        }

        this.mesh.instanceMatrix.needsUpdate = true;
        this._program.canvas.render();
    }
}

async function pointDown(guide, start) {
    await guide._input.pointDown(start, guide._operations, OperationTypes.LINE);

    if (guide._operations.length == 1) return;

    const cmd = guide._operations.join(",");
    const data = pattern(cmd, 10, 0.01);
    await guide.draw(data);
}

async function pointMove(guide, point) {
    await guide._input.pointMove(point, guide._operations, OperationTypes.LINE);

    if (guide._operations.length == 1) return;

    const cmd = guide._operations.join(",");
    const data = pattern(cmd, 10, 0.01);
    await guide.draw(data);
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

async function createVector(data, i) {
    return await crs.createThreeObject("Vector3", Number(data[i + 1]), Number(data[i + 2]), Number(data[i + 3]));
}
