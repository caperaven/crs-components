export const program = {
    fragmentShader: "/app/load-canvas-program/shaders/fragment-shader.glsl",
    vertexShader: "/app/load-canvas-program/shaders/vertex-shader.glsl",
    uniforms: {
        u_opacity: {value: 1},
        u_colorA: {value: 0xff0000},
        u_colorB: {value: 0x0000FF},
        u_map: {
            type: "t",
            value: "/fonts/opensans/OpenSans-Regular.png"
        }
    },
    scene: {
        type: "shape",
        shape: "plane",
        parameters: {
            width: 500,
            height: 500
        }
    }
}