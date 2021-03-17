import {createClassFromModule} from "../helpers/class-import-factory.js";
import {threePaths} from "../threejs-paths.js";
import {updateMaterial} from "../helpers/update-material.js";
import {BaseManager} from "./base-manager.js";

export default class MaterialManager extends BaseManager {
    get key() {
        return "materials";
    }

    async processItem(materials, program) {
        if (materials == null) return;
        for (let material of materials) {
            if (program._materials.has(material.id) == false) {
                const result = await createClassFromModule(threePaths(material.type), material.type);
                await updateMaterial(result, material.parameters);
            }
        }
    }
}