import {MeshLineMaterial} from "../../third-party/three/external/meshes/mesh-line/mesh-line-material.js";

const params = {
    curves             : true,
    circles            : false,
    amount             : 100,
    lineWidth          : 10,
    dashArray          : 0.6,
    dashOffset         : 0,
    dashRatio          : 0.5,
    taper              : 'parabolic',
    strokes            : false,
    sizeAttenuation    : false,
    animateWidth       : false,
    spread             : false,
    autoRotate         : true,
    autoUpdate         : true,
    animateVisibility  : false,
    animateDashOffset  : false
}

export default class MeshLine extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.resolution = null; // canvas width and height
        await this.initialize();
    }

    async initialize() {
        const parameters = {
            map             : await this.loadTexture(),
            useMap          : params.strokes,
            color           : await crs.createColor("#ffbb00"),
            opacity         : 1,
            dashArray       : params.dashArray,
            dashOffset      : params.dashOffset,
            dashRatio       : params.dashRatio,
            resolution      : this.resolution,
            sizeAttenuation : params.sizeAttenuation,
            lineWidth       : params.lineWidth,
            depthWrite      : false,
            depthTest       : !params.strokes,
            alphaTest       : params.strokes ? .5 : 0,
            transparent     : true,
            side            : await crs.getThreeConstant("DoubleSide")
        }

        this.material = await MeshLineMaterial.new(parameters);

        console.log(this.material);
    }

    loadTexture() {
        return new Promise(async resolve => {
            const loader = await crs.createThreeObject("TextureLoader");

            loader.load( '/app/mesh-line/images/stroke.png', function( texture ) {
                resolve(texture);
            });
        })
    }
}