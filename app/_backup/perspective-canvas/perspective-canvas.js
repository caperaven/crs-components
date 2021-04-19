import "../../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {BoxGeometry} from "/node_modules/three/src/geometries/BoxGeometry.js";
import {MeshBasicMaterial} from "/node_modules/three/src/materials/MeshBasicMaterial.js";
import {Color} from "/node_modules/three/src/math/Color.js";
import {Mesh} from "/node_modules/three/src/objects/Mesh.js";

export default class Welcome extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("perspective-canvas");
        this.animateHandler = this.animate.bind(this);
        const ready = async () => {
            this.canvas.removeEventListener("ready", ready);
            const geometry = new BoxGeometry();
            const material = new MeshBasicMaterial({color: new Color(0xff0090)});
            this.cube = new Mesh(geometry, material);
            this.canvas.scene.add(this.cube);

            this.canvas.camera.position.z = 5;
            await this.animate();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async disconnectedCallback() {
        this.cube = null;
        this.canvas = null;
        this.animateHandler = null;
        await super.disconnectedCallback();
    }

    async animate(time) {
        if (this.animateHandler == null) return;
        requestAnimationFrame(this.animateHandler);
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.canvas.render();
    }
}