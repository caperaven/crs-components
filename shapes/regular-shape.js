import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {CircleGeometry} from "/node_modules/three/src/geometries/CircleGeometry.js";

export async function createRegularMesh(material, segments, radius) {
    const buffer = new CircleGeometry(radius, segments)
    return new Mesh(buffer, material);
}