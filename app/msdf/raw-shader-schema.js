export const rawShaderSchema = {
    requires: [
        "/src/components/orthographic-canvas/orthographic-canvas.js"
    ],
    context: {
        type: "orthographic",
        attributes: {
            background: "#dadada"
        },
    },
    textures: [
        {
            id: "font",
            texture: "/fonts/opensans/OpenSans-Regular.png"
        }
    ],
    materials: [
        {
            id: 0,
            type: "RawShaderMaterial",
            args: {
                fragmentShader: "/app/msdf/shaders/fragment-shader.glsl",
                transparent: true,
                glslVersion: "GLSL3",
                uniforms: {
                    map: {type: "t", value: "font"},
                    fgColor: {value: "#ff0090"},
                    distanceFactor: 10.0
                }
            }
        }
    ],
    scene: {
        elements: [
            {
                element: "PlaneGeometry",
                material: 0,
                args: {
                    transform: {
                        scale: {x: 256, y: 256}
                    }
                }
            }
        ]
    }
}