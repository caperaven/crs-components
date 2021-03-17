import {BaseProvider} from "../base-provider.js";
import {createThreeObject, getThreePrototype} from "./../../threejs-paths.js";

export default class LineGeometryProvider extends BaseProvider {
    get key() {
        return "LineGeometry";
    }

    async processItem(item, program) {
        const Vector3 = await getThreePrototype("Vector3");
        const geometry = await createThreeObject("BufferGeometry");
        const points = [];
        for (let point of item.points) {
            points.push(new Vector3(point.x, point.y, point.z));
        }
        geometry.setFromPoints(points);

        const material = program.materials.get(item.material);

        const line = await createThreeObject("Line", geometry, material);
        return line;
    }
}