export const MaterialType = Object.freeze({
    BASIC   : "MeshBasicMaterial",
    LINE    : "MeshLineMaterial",
    INSTANCE: "InstanceMaterial",
    SHADER  : "RawShaderMaterial"
})

export class Materials {
    constructor() {
        this.materials = {
            [MaterialType.BASIC]: {},
            [MaterialType.LINE]: {}
        };
    }

    dispose() {
        const types = Object.keys(this.materials);
        for (let type of types) {
            const keys = Object.keys(this.materials[type]);
            for (let key of keys) {
                const material = this.materials[type][key];
                material.dispose();
                this.materials[type][key] = null;
            }
        }

        delete this.materials;
        return null;
    }

    async get(type, color) {
        let material = this.materials[type]?.[color];
        if (material == null) {
            material = this[type](color);
            this.materials[type][color] = material;
        }
        return material;
    }

    async getById(id) {
        return this.materials[MaterialType.BASIC]?.[id] || this.materials[MaterialType.SHADER]?.[id] || this.materials[MaterialType.LINE]?.[id] || this.materials[MaterialType.INSTANCE]?.[id];
    }

    async set(type, id, material) {
        if (this.materials[type] == null) {
            this.materials[type] = {};
        }

        this.materials[type][id] = material;
    }

    async has(type, id) {
        return this.materials[type]?.[id] != null;
    }

    async [MaterialType.BASIC](color) {
        return await crs.createThreeObject("MeshBasicMaterial", {color: color});
    }

    async [MaterialType.LINE](color) {
        return {type: "line"}
    }
}