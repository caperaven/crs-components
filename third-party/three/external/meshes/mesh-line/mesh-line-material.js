import {ShaderChunk} from "./../../../src/renderers/shaders/ShaderChunk.js";
import {UniformsLib} from "./../../../src/renderers/shaders/UniformsLib.js";
import {ShaderMaterial} from "./../../../src/materials/ShaderMaterial.js";

if (ShaderChunk.meshline_vert == null) {
    ShaderChunk.meshline_vert = [
        '',
        ShaderChunk.logdepthbuf_pars_vertex,
        ShaderChunk.fog_pars_vertex,
        '',
        'attribute vec3 previous;',
        'attribute vec3 next;',
        'attribute float side;',
        'attribute float width;',
        'attribute float counters;',
        '',
        'uniform vec2 resolution;',
        'uniform float lineWidth;',
        'uniform vec3 color;',
        'uniform float opacity;',
        'uniform float sizeAttenuation;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying float vCounters;',
        '',
        'vec2 fix( vec4 i, float aspect ) {',
        '',
        '    vec2 res = i.xy / i.w;',
        '    res.x *= aspect;',
        '	 vCounters = counters;',
        '    return res;',
        '',
        '}',
        '',
        'void main() {',
        '',
        '    float aspect = resolution.x / resolution.y;',
        '',
        '    vColor = vec4( color, opacity );',
        '    vUV = uv;',
        '',
        '    mat4 m = projectionMatrix * modelViewMatrix;',
        '    vec4 finalPosition = m * vec4( position, 1.0 );',
        '    vec4 prevPos = m * vec4( previous, 1.0 );',
        '    vec4 nextPos = m * vec4( next, 1.0 );',
        '',
        '    vec2 currentP = fix( finalPosition, aspect );',
        '    vec2 prevP = fix( prevPos, aspect );',
        '    vec2 nextP = fix( nextPos, aspect );',
        '',
        '    float w = lineWidth * width;',
        '',
        '    vec2 dir;',
        '    if( nextP == currentP ) dir = normalize( currentP - prevP );',
        '    else if( prevP == currentP ) dir = normalize( nextP - currentP );',
        '    else {',
        '        vec2 dir1 = normalize( currentP - prevP );',
        '        vec2 dir2 = normalize( nextP - currentP );',
        '        dir = normalize( dir1 + dir2 );',
        '',
        '        vec2 perp = vec2( -dir1.y, dir1.x );',
        '        vec2 miter = vec2( -dir.y, dir.x );',
        '        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );',
        '',
        '    }',
        '',
        '    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;',
        '    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );',
        '    normal.xy *= .5 * w;',
        '    normal *= projectionMatrix;',
        '    if( sizeAttenuation == 0. ) {',
        '        normal.xy *= finalPosition.w;',
        '        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;',
        '    }',
        '',
        '    finalPosition.xy += normal.xy * side;',
        '',
        '    gl_Position = finalPosition;',
        '',
        ShaderChunk.logdepthbuf_vertex,
        ShaderChunk.fog_vertex && '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        ShaderChunk.fog_vertex,
        '}',
    ].join('\n');
}

if (ShaderChunk.meshline_frag == null) {
    ShaderChunk.meshline_frag = [
        '',
        ShaderChunk.fog_pars_fragment,
        ShaderChunk.logdepthbuf_pars_fragment,
        '',
        'uniform sampler2D map;',
        'uniform sampler2D alphaMap;',
        'uniform float useMap;',
        'uniform float useAlphaMap;',
        'uniform float useDash;',
        'uniform float dashArray;',
        'uniform float dashOffset;',
        'uniform float dashRatio;',
        'uniform float visibility;',
        'uniform float alphaTest;',
        'uniform vec2 repeat;',
        '',
        'varying vec2 vUV;',
        'varying vec4 vColor;',
        'varying float vCounters;',
        '',
        'void main() {',
        '',
        ShaderChunk.logdepthbuf_fragment,
        '',
        '    vec4 c = vColor;',
        '    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
        '    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
        '    if( c.a < alphaTest ) discard;',
        '    if( useDash == 1. ){',
        '        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
        '    }',
        '    gl_FragColor = c;',
        '    gl_FragColor.a *= step(vCounters, visibility);',
        '',
        ShaderChunk.fog_fragment,
        '}',
    ].join('\n');
}

let Color;
let Vector2;

export class MeshLineMaterial extends ShaderMaterial {
    static async new(parameters) {
        Color     = await crs.getThreePrototype("Color");
        Vector2   = await crs.getThreePrototype("Vector2");

        const uniforms = Object.assign({}, UniformsLib.fog, {
            lineWidth: { value: 1 },
            map: { value: null },
            useMap: { value: 0 },
            alphaMap: { value: null },
            useAlphaMap: { value: 0 },
            color: { value: new Color(0xffffff) },
            opacity: { value: 1 },
            resolution: { value: new Vector2(1, 1) },
            sizeAttenuation: { value: 1 },
            dashArray: { value: 0 },
            dashOffset: { value: 0 },
            dashRatio: { value: 0.5 },
            useDash: { value: 0 },
            visibility: { value: 1 },
            alphaTest: { value: 0 },
            repeat: { value: new Vector2(1, 1) },
        });

        const vertexShader = ShaderChunk.meshline_vert;
        const fragmentShader = ShaderChunk.meshline_frag;
        const result = new MeshLineMaterial(uniforms, vertexShader, fragmentShader, parameters);
        return result;
    }

    get lineWidth() {
        return this.getProperty("lineWidth", {value: 1});
    }

    set lineWidth(newValue) {
        this.setProperty("lineWidth", newValue);
    }

    get map() {
        return this.getProperty("map", {value: null});
    }

    set map(newValue) {
        this.setProperty("map", newValue);
    }

    get useMap() {
        return this.getProperty("useMap", {value: 0});
    }

    set useMap(newValue) {
        this.setProperty("useMap", newValue);
    }

    get alphaMap() {
        return this.getProperty("alphaMap", {value: null});
    }

    set alphaMap(newValue) {
        this.setProperty("alphaMap", newValue);
    }

    get useAlphaMap() {
        return this.getProperty("alphaMap", {value: 0});
    }

    set useAlphaMap(newValue) {
        this.setProperty("useAlphaMap", newValue);
    }

    get color() {
        return this.getProperty("color", { value: new Color(0xffffff) });
    }

    set color(newValue) {
        this.setProperty("color", newValue);
    }

    get opacity() {
        return this.getProperty("opacity", {value: 1});
    }

    set opacity(newValue) {
        this.setProperty("opacity", newValue);
    }

    get resolution() {
        return this.getProperty("resolution", { value: new Vector2(1, 1) });
    }

    set resolution(newValue) {
        this.setProperty("resolution", newValue);
    }

    get sizeAttenuation() {
        return this.getProperty("sizeAttenuation", {value: 0});
    }

    set sizeAttenuation(newValue) {
        this.setProperty("sizeAttenuation", newValue);
    }

    get dashArray() {
        return this.getProperty("dashArray", {value: 0});
    }

    set dashArray(newValue) {
        this.setProperty("dashArray", newValue);
        this.useDash = newValue !== 0 ? 1 : 0;
    }

    get dashOffset() {
        return this.getProperty("dashOffset", {value: 0});
    }

    set dashOffset(newValue) {
        this.setProperty("dashOffset", newValue);
    }

    get dashRatio() {
        return this.getProperty("dashRatio", {value: 0.5});
    }

    set dashRatio(newValue) {
        this.setProperty("dashRatio", newValue);
    }

    get useDash() {
        return this.getProperty("useDash", {value: 0});
    }

    set useDash(newValue) {
        this.setProperty("useDash", newValue);
    }

    get visibility() {
        return this.getProperty("visibility", {value: 1});
    }

    set visibility(newValue) {
        this.setProperty("visibility", newValue);
    }

    get alphaTest() {
        return this.getProperty("alphaTest", {value: 0});
    }

    set alphaTest(newValue) {
        this.setProperty("alphaTest", newValue);
    }

    get repeat() {
        return this.getProperty("repeat", {value: 0});
    }

    set repeat(newValue) {
        this.setProperty("repeat", newValue);
    }

    constructor(uniforms, vertexShader, fragmentShader, parameters) {
        super({
            uniforms        : uniforms,
            vertexShader    : vertexShader,
            fragmentShader  : fragmentShader
        });

        const keys = Object.keys(this.props);
        for (let key of keys) {
            this[key] = this.props[key];
        }
        delete this.props;

        this.type               = 'MeshLineMaterial';
        this.isMeshLineMaterial = true;
        this.setValues(parameters);
    }

    setProperty(name, value) {
        if (this.uniforms == null) {
            this.props = this.props || {};
            return this.props[name] = value;
        }

        this.uniforms[name].value = value;
    }

    getProperty(name, defaultValue) {
        if (this.uniforms == null) return defaultValue;
        return this.uniforms[name].value;
    }

    copy(source) {
        super.copy(source);

        this.lineWidth = source.lineWidth;
        this.map = source.map;
        this.useMap = source.useMap;
        this.alphaMap = source.alphaMap;
        this.useAlphaMap = source.useAlphaMap;
        this.color.copy(source.color);
        this.opacity = source.opacity;
        this.resolution.copy(source.resolution);
        this.sizeAttenuation = source.sizeAttenuation;
        this.dashArray.copy(source.dashArray);
        this.dashOffset.copy(source.dashOffset);
        this.dashRatio.copy(source.dashRatio);
        this.useDash = source.useDash;
        this.visibility = source.visibility;
        this.alphaTest = source.alphaTest;
        this.repeat.copy(source.repeat);

        return this;
    }
}