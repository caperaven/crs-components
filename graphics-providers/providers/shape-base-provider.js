import {Mesh} from "/node_modules/three/src/objects/Mesh.js";

export class ShapeBaseProvider {
    async processItem(item) {
        const geometry = await this.createGeometry();

        const material = await this.process_material(item.material);
        const mesh = new Mesh(geometry, material);
        mesh.scale.set(item.width || 1, item.height || 1, 1);
        return mesh;
    }

    async createGeometry() {

    }

    async process_material() {

    }
}