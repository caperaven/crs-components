import "../../../src/gfx-components/perspective-canvas/perspective-canvas.js";

export default class Curves extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.canvas = this.element.querySelector("perspective-canvas");

        const ready = async () => {
            this.canvas.removeEventListener("ready", ready);
            this.canvas.camera.position.z = 15;
            await this.initialize();
        }

        this.canvas.addEventListener("ready", ready);
    }

    async initialize() {
        await this.catMull();
    }

    async catMull() {
        const Vector3 = await crs.getThreePrototype("Vector3");
        const CatmullRomCurve3 = await crs.getThreePrototype("CatmullRomCurve3");
        const BufferGeometry = await crs.getThreePrototype("BufferGeometry");
        const LineBasicMaterial = await crs.getThreePrototype("LineBasicMaterial");
        const Line = await crs.getThreePrototype("Line");

        const curve = new CatmullRomCurve3( [
            new Vector3( -10, 0, 10 ),
            new Vector3( -5, 5, 5 ),
            new Vector3( 0, 0, 0 ),
            new Vector3( 5, -5, 5 ),
            new Vector3( 10, 0, 10 )
        ] );

        const points = curve.getPoints( 128 );
        const geometry = new BufferGeometry().setFromPoints( points );
        const material = new LineBasicMaterial( { color : 0xff0000, linewidth: 50 } );
        const curveObject = new Line( geometry, material );

        this.canvas.scene.add(curveObject);
        this.canvas.render();
    }
}