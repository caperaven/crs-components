import {BaseProvider} from "../base-provider.js";
import {rawToGeometry} from "./../../../gfx-helpers/raw-to-geometry.js";

export default class CurveGeometryProvider extends BaseProvider {
    get key() {
        return "CurveGeometry";
    }

    async processItem(item, program) {
        const curvePath = await crs.createThreeObject("CurvePath");

        await dataToCurvePath(curvePath, item.args.data);

        const iconName = `${item.args.icon}Data`;

        const data      = (await import(`./../../../geometry-data/icons/${iconName}.js`))[iconName];
        const geometry  = await rawToGeometry(data);
        const material  = await this.getMaterial(item.material, program);
        const scale     = await createVector(item.args.transform.split(","), 0);
        const gap       = Number(item.args.gap || 0);
        const length    = curvePath.getLength();
        const size      = scale.y + gap;
        const count     = Math.round(length / size);
        const up        = await crs.createThreeObject("Vector3", 0, 1, 0 );
        const axis      = await crs.createThreeObject("Vector3");
        const mesh      = await crs.createThreeObject("InstancedMesh", geometry, material, count);
        const dummy     = await crs.createThreeObject("Object3D");

        mesh.name       = item.id;

        for (let i = 0; i <= count; i++) {
            const norm = i / count;
            const tangent = curvePath.getTangent(norm);

            axis.crossVectors(up, tangent).normalize();
            const radians = Math.acos(up.dot(tangent));
            const point = curvePath.getPointAt(norm);

            dummy.position.copy(point);
            dummy.scale.set(scale.x, scale.y, scale.z);
            dummy.quaternion.setFromAxisAngle(axis, radians);
            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);
        }

        return mesh;
    }
}

async function dataToCurvePath(curvePath, data) {
    const curveBuilder = new CurvesBuilder(data, curvePath);
    await curveBuilder.process();
    curveBuilder.dispose();
}

class CurvesBuilder {
    constructor(data, curvePath) {
        this.data = data.split(",");
        this.curvePath = curvePath;
        return this;
    }

    dispose() {
        delete this.data;
    }

    async process() {
        let i = 0;
        while (i < this.data.length) {
            const char = this.data[i].trim().toLowerCase();

            i = await this[char](i);
        }
    }

    async m (i) {
        this._p1 = await createVector(this.data, i);
        return i + 4;
    }

    async l (i) {
        const p2 = await createVector(this.data, i);
        const curve = await crs.createThreeObject("LineCurve3", this._p1, p2);
        this.curvePath.add(curve);

        this._p1 = p2;
        return i + 4;
    }

    async c (i) {
        const cp1 = await createVector(this.data, i + 1);
        const cp2 = await createVector(this.data, i + 4);
        const p2  = await createVector(this.data, i + 7);
        const curve = await crs.createThreeObject("CubicBezierCurve3", this._p1, cp1, cp2, p2);
        this.curvePath.add(curve);
        this._p1 = p2;
        return i + 10;
    }

    async q(i) {
        const cp1 = await createVector(this.data, i);
        const p2  = await createVector(this.data,i + 4);
        const curve = await crs.createThreeObject("QuadraticBezierCurve3", this._p1, cp1, p2);
        this.curvePath.add(curve);
        this._p1 = p2;
        return i + 7;
    }

    async z(i) {
        return i + 1;
    }
}

async function createVector(data, i) {
    return await crs.createThreeObject("Vector3", Number(data[i + 1]), Number(data[i + 2]), Number(data[i + 3]));
}
