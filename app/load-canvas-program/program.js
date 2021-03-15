export const program = {
    fragmentShader: "/app/load-canvas-program/shaders/fragment-shader.glsl",
    vertexShader: "/app/load-canvas-program/shaders/vertex-shader.glsl",
    uniforms: {
        opacity: 1,
        color: 0xff0090,
        map: {
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