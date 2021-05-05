export class BaseProvider {
    constructor(parser) {
        this.parser = parser;
    }

    async dispose() {
        delete this.parser;
    }

    async processMaterial(item, program) {
        if (item?.material == null) {
            return false;
        }

        program._processMaterials.push(program.materials.get(item.material));
        return true;
    }

    async getMaterial(material, program) {
        if (material != null) {
            return await program.materials.get(material);
        }

        if (program._processMaterials.length > 0) {
            return program._processMaterials[program._processMaterials.length - 1];
        }

        return null;
    }
}