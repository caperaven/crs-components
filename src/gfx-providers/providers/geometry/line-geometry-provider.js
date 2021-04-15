import {BaseProvider} from "../base-provider.js";

export default class LineGeometryProvider extends BaseProvider {
    get key() {
        return "LineGeometry";
    }

    async processItem(item, program) {
        const Vector3 = await crs.getThreePrototype("Vector3");
        const geometry = await crs.createThreeObject("BufferGeometry");
        const points = [];
        for (let point of item.args.points) {
            points.push(new Vector3(point.x, point.y, point.z));
        }
        geometry.setFromPoints(points);

        const material = program.materials.get(item.material);
        return await crs.createThreeObject("Line", geometry, material);
    }
}