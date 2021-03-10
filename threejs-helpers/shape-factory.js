import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";

export function createNormalizedPlane(width = 1, height = 1) {
    const geometry = new PlaneGeometry(1, 1);
    const material = new MeshBasicMaterial();
    const result = new Mesh(geometry, material);
    result.scale.set(width, height, 1);
    return result;
}