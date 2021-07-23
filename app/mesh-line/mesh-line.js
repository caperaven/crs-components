import "../../../src/gfx-components/perspective-canvas/perspective-canvas.js";
import {MeshLine} from "./../../third-party/three/external/meshes/mesh-line/mesh-line.js";
import {MeshLineMaterial} from "./../../third-party/three/external/meshes/mesh-line/mesh-line-material.js";

export default class MeshLineView extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.canvas = this.element.querySelector("perspective-canvas");
        this.animateHandler = this.animate.bind(this);

        const ready = async () => {
            this.canvas.removeEventListener("ready", ready);
            this.canvas.camera.position.z = 5;
            await this.initialize();
            this.animate();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async initialize() {
        this.points = [];
        this.points.push(-5, 0, 0, 0, 1, 0,  5, 0, 0);

        const texture = await this.loadImage();
        const blending = await crs.getThreeConstant("NormalBlending");
        const material = await MeshLineMaterial.new({
                useMap: true,
                map: texture,
                color: await crs.createColor("#ff0090"),
                resolution: { x: this.canvas.width, y: this.canvas.height },
                sizeAttenuation:false,
                blending: blending,
                lineWidth: 20,
                transparent: true,
                repeat: await crs.createThreeObject("Vector2", 10, 1)
            })

        const geometry = await MeshLine.new(material);
        await geometry.setPoints(this.points);

        this.mesh = await crs.createThreeObject("Mesh", geometry, material);

        this.canvas.scene.add(this.mesh);
        this.canvas.render();
    }

    loadImage() {
        return new Promise(async resolve => {
            const loader = await crs.createThreeObject("TextureLoader");
            loader.load('/app/mesh-line/images/stroke2.png', async texture => {
                const strokeTexture = texture;
                strokeTexture.wrapS = strokeTexture.wrapT = await crs.getThreeConstant("RepeatWrapping");
                resolve(strokeTexture);
            });
        })
    }

    animate() {
        if (this.animateHandler == null) return;
        requestAnimationFrame(this.animateHandler);
        let point = this.points[4];
        point += 0.01;
        if (point > 4) {
            point = -4;
        }
        this.points[4] = point;
        this.mesh.geometry.setPoints(this.points);
        this.canvas.render();
    }

    add() {
        this.points.push(5,2,0);
        this.mesh.geometry.setPoints(this.points);
    }
}