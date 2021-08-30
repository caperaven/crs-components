import {BaseProvider} from "../base-provider.js";
import {rawToGeometry} from "./../../../gfx-helpers/raw-to-geometry.js";
import init, {pattern} from "./../../../../wasm/geometry/bin/geometry.js";

export default class CurveGeometryProvider extends BaseProvider {
    get key() {
        return "CurveGeometry";
    }

    async processItem(item, program) {
        await init();

        const scale     = await createVector(item.args.transform.split(","), 0);
        const gap       = Number(item.args.gap || 0);
        const size      = scale.y + gap;

        let data = pattern(item.args.data, size, 0.1);
        const iconName  = `${item.args.icon}Data`;
        const imageData = (await import(`./../../../geometry-data/icons/${iconName}.js`))[iconName];
        const up        = await crs.createThreeObject("Vector3", 0, 1, 0 );
        const axis      = await crs.createThreeObject("Vector3");

        const geometry  = await rawToGeometry(imageData);
        const material  = await program.materials.getById(item.material);
        const mesh      = await crs.createThreeObject("InstancedMesh", geometry, material, data.length);
        const dummy     = await crs.createThreeObject("Object3D");

        let i = 0;
        for (let item of data) {
            const tangent = await createVector([item.tx, item.ty, 0], -1);
            axis.crossVectors(up, tangent).normalize();

            dummy.quaternion.setFromAxisAngle(axis, item.radians);
            dummy.position.x = item.px;
            dummy.position.y = item.py;
            dummy.scale.set(scale.x, scale.y, scale.z);

            //dummy.rotation.set(0, 0, item.radians);

            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);
            i++;
        }

        return mesh;
    }
}

async function createVector(data, i) {
    return await crs.createThreeObject("Vector3", Number(data[i + 1]), Number(data[i + 2]), Number(data[i + 3]));
}
