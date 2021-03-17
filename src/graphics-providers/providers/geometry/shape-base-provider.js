import {BaseProvider} from "../base-provider.js";
import {updateTransform} from "../../helpers/update-transforms.js";

export class ShapeBaseProvider extends BaseProvider {
    async processItem(item, program) {
        const geometry = await crs.createThreeObject(this.key);
        const material = await program.materials.get(item.material);
        const mesh = await crs.createThreeObject("Mesh", geometry, material);
        updateTransform(mesh, item.transform);
        return mesh;
    }
}