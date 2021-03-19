import {updateMaterial} from "../helpers/update-material.js";
import {BaseManager} from "./base-manager.js";

export default class MaterialManager extends BaseManager {
    get key() {
        return "materials";
    }

    async processItem(materials, program) {
        if (materials == null) return;
        for (let material of materials) {
            if (program.materials.has(material.id) == false) {
                const result = await crs.createThreeObject(material.type);
                await updateMaterial(result, material.args, program);
                program.materials.set(material.id, result);
            }
        }
    }
}