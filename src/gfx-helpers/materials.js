export const MaterialType = Object.freeze({
    BASIC   : "MeshBasicMaterial",
    LINE    : "MeshLineMaterial"
})

export class Materials {
    constructor() {
        this.materials = {
            [MaterialType.BASIC]: {},
            [MaterialType.LINE]: {}
        };
    }

    dispose() {
    }

    async get(type, color) {
        let material = this.materials[type][color];
        if (material == null) {
            material = this[type](color);
            this.materials[type][color] = material;
        }
        return material;
    }

    async [MaterialType.BASIC](color) {
        return {type: "color"}
    }

    async [MaterialType.LINE](color) {
        return {type: "line"}
    }
}