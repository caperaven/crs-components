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
        const scale     = await CurvesParser.createVector(item.args.transform.split(","), 1);
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
    const dataParts = data.split(",");

    let i = 0;
    while (i < dataParts.length) {
        const char = dataParts[i].trim().toLowerCase();
        i = await CurvesParser[char](dataParts, i, curvePath);
    }
}

class CurvesParser {
    static async l(data, i, curvePath) {
        const p1 = await this.createVector(data,i + 1);
        const p2 = await this.createVector(data, i + 4);
        const curve = await crs.createThreeObject("LineCurve3", p1, p2);
        curvePath.add(curve);
        return i + 7;
    }

    static async c(data, i, curvePath) {
        const p1  = await this.createVector(data,i + 1);
        const cp1 = await this.createVector(data, i + 4);
        const cp2 = await this.createVector(data, i + 7);
        const p2  = await this.createVector(data, i + 10);
        const curve = await crs.createThreeObject("CubicBezierCurve3", p1, cp1, cp2, p2);
        curvePath.add(curve);
        return i + 13;
    }

    static async q(data, i, curvePath) {
        const p1  = await this.createVector(data,i + 1);
        const cp1 = await this.createVector(data, i + 4);
        const p2  = await this.createVector(data,i + 7);
        const curve = await crs.createThreeObject("QuadraticBezierCurve3", p1, cp1, p2);
        curvePath.add(curve);
        return i + 10;
    }

    static async createVector(data, i) {
        return await crs.createThreeObject("Vector3", Number(data[i]), Number(data[i + 1]), Number(data[i + 2]));
    }
}

