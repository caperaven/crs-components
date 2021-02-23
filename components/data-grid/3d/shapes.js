import {BoxGeometry}  from "/node_modules/three/src/geometries/BoxGeometry.js";
import {PlaneGeometry} from "/node_modules/three/src/geometries/PlaneGeometry.js";
import {MeshPhongMaterial} from "/node_modules/three/src/materials/MeshPhongMaterial.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";
import {Color} from "/node_modules/three/src/math/Color.js";

export function addCube(scene, color) {
    const geometry = new BoxGeometry();
    const material = new MeshPhongMaterial({color: color});
    const cube = new Mesh(geometry, material);
    scene.add(cube);
    return cube;
}

export function addPlane(scene, texture, width, height) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({map: texture});
    const plane = new Mesh(geometry, material);
    scene.add(plane);
    return plane;
}