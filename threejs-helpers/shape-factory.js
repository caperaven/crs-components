import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {CircleGeometry} from "/node_modules/three/src/geometries/CircleGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";

export function createNormalizedPlane(width = 1, height = 1, material = null) {
    const geometry = new PlaneGeometry(1, 1);

    if (material == null) {
        material = new MeshBasicMaterial();
    }

    const result = new Mesh(geometry, material);
    result.scale.set(width, height, 1);
    return result;
}

export async function createRegularMesh(material, segments, radius) {
    const buffer = new CircleGeometry(radius, segments)
    return new Mesh(buffer, material);
}