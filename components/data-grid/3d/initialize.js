import {Scene}  from "/node_modules/three/src/scenes/scene.js";
import {PerspectiveCamera} from '/node_modules/three/src/cameras/PerspectiveCamera.js';
import {OrthographicCamera} from '/node_modules/three/src/cameras/OrthographicCamera.js';
import {WebGLRenderer} from '/node_modules/three/src/renderers/WebGLRenderer.js';
import {DirectionalLight} from '/node_modules/three/src/lights/DirectionalLight.js';
import {AmbientLight} from '/node_modules/three/src/lights/AmbientLight.js';

export function initialize(cameraPosition, rendererParameters, lightProperties, parentElement) {
    const aspect = parentElement.rect.width / parentElement.rect.height;
    const size = parentElement.rect.width;
    const left = -aspect * size / 2;
    const right = aspect * size / 2;
    const top = size / 2;
    const bottom = -size / 2;

    const result = {
        scene: new Scene(),
        light: new DirectionalLight(lightProperties.color, lightProperties.intensity),
        ambient: new AmbientLight(0x404040),
        //camera: new PerspectiveCamera(75, cameraPosition.viewWidth / cameraPosition.viewHeight, 0.1, 1000),
        camera: new OrthographicCamera(left, right, top, bottom, 0.1, 1000),
        renderer: new WebGLRenderer(rendererParameters)
    }

    result.light.position.x = lightProperties.x;
    result.light.position.y = lightProperties.y;
    result.light.position.z = lightProperties.z;

    result.renderer.setSize(cameraPosition.viewWidth, cameraPosition.viewHeight);
    parentElement.appendChild(result.renderer.domElement);

    result.camera.position.z = cameraPosition.z;

    result.scene.add(result.light);
    result.scene.add(result.ambient);

    return result;
}