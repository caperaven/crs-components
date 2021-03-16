export const program = {
    fragmentShader: "/app/load-canvas-program/shaders/fragment-shader.glsl",
    vertexShader: "/app/load-canvas-program/shaders/vertex-shader.glsl",
    uniforms: {
        u_fgColor: {value: 0xff0090},
        u_bgColor: {value: 0xffffff},
        u_msdf: {
            type: "t",
            value: "/fonts/opensans/OpenSans-Regular.png"
        },
        u_pxRange: 1
    },
    defines: {
        "HALF_SAMPLE_RATE": 0.125,
        "SAMPLE_RATE": 0.25,
        "HORIZONTAL_PASS": 1
    },
    scene: {
        type: "shape",
        shape: "plane",
        parameters: {
            width: 500,
            height: 500
        }
    },
    extensions: [
        {
            ext: "transform",
            parameters: {

            }
        }
    ]
}