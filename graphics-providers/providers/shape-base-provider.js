import {BaseProvider} from "./base-provider.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {threePaths} from "./../threejs-paths.js";
import {createClassFromModule} from "./../helpers/class-import-factory.js";
import {updateTransform} from "./../helpers/update-transforms.js";

export class ShapeBaseProvider extends BaseProvider {
    async processItem(item, program) {
        const geometry = await createClassFromModule(threePaths(this.key), this.key);
        const material = await program.materials.get(item.material);
        const mesh = new Mesh(geometry, material);
        updateTransform(mesh, item.transform);
        return mesh;
    }
}