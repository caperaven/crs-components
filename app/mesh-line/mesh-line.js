import "../../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {MeshLine} from "./../../third-party/three/external/meshes/mesh-line/mesh-line.js";
import {MeshLineMaterial} from "./../../third-party/three/external/meshes/mesh-line/mesh-line-material.js";

export default class MeshLineView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("perspective-canvas");
        //this.animateHandler = this.animate.bind(this);

        const ready = async () => {
            this.canvas.removeEventListener("ready", ready);
            this.canvas.camera.position.z = 5;
            await this.initialize();
            //this.animate();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async initialize() {
        this.points = [];
        this.points.push(-5, 0, 0, 0, 1, 0,  5, 0, 0);

        const material = await MeshLineMaterial.new({
                useMap:         false ,
                color:          await crs.createColor("#ff0090"),
                opacity:        1,
                resolution:     { x: this.canvas.width, y: this.canvas.height },
                sizeAttenuation:false,
                lineWidth:      10
            })

        const geometry = await MeshLine.new(material);
        await geometry.setPoints(this.points);

        const mesh = await crs.createThreeObject("Mesh", geometry, material);

        this.canvas.scene.add(mesh);
        this.canvas.render();
    }

    // animate() {
    //     requestAnimationFrame(this.animateHandler);
    //     let point = this.mesh.geometry.attributes.position.array[4];
    //     point += 0.01;
    //     if (point > 4) {
    //         point = -4;
    //     }
    //     this.mesh.geometry.attributes.position.array[4] = point;
    //     this.mesh.geometry.attributes.position.needsUpdate = true;
    //     this.canvas.render();
    // }
}