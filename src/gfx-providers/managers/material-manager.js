import {updateMaterial} from "../helpers/update-material.js";
import {BaseManager} from "./base-manager.js";
import {Materials, MaterialType} from "./../../gfx-helpers/materials.js";

export default class MaterialManager extends BaseManager {
    get key() {
        return "materials";
    }

    async processItem(materials, program) {
        if (materials == null) return;

        if (program.materials == null) {
            this.enable(program);
        }

        for (let material of materials) {
            if (await program.materials.has(material.type, material.id) == false) {
                if (this.parser.providers.has(material.type) == true) {
                    await this.parser.providers.get(material.type).processItem(material, program);
                }
                else {
                    const result = await crs.createThreeObject(material.type);
                    await updateMaterial(result, material.args, program);
                    await program.materials.set(material.type, material.id, result);
                }
            }
        }
    }

    enable(program) {
        program.MaterialType = MaterialType;
        program.materials = new Materials();
        program._disposables.push(dispose.bind(program));
    }
}

async function dispose() {
    this.materials.dispose();
    delete this.MaterialType;
    delete this.materials;
}