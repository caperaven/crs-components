import {updateMaterial} from "../helpers/update-material.js";
import {BaseManager} from "./base-manager.js";

export default class MaterialManager extends BaseManager {
    get key() {
        return "materials";
    }

    async processItem(materials, program) {
        if (materials == null) return;

        if (program.materials == null) {
            program.materials = new Map();
            program._disposables.push(program.materials)
        }

        for (let material of materials) {
            if (program.materials.has(material.id) == false) {
                if (this.parser.providers.has(material.type) == true) {
                    await this.parser.providers.get(material.type).processItem(material, program);
                }
                else {
                    const result = await crs.createThreeObject(material.type);
                    await updateMaterial(result, material.args, program);
                    program.materials.set(material.id, result);
                }
            }
        }
    }
}