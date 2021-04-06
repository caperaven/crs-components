export const rawShaderSchema = {
    requires: [
        "orthographic-canvas"
    ],
    context: {
        type: "orthographic",
    },
    textures: [
        {
            id: "font",
            texture: "/fonts/opensans/OpenSans-Bold.png"
        }
    ],
    materials: [
        {
            id: 0,
            type: "RawShaderMaterial",
            args: {
                fragmentShader: "/app/graphics-schema/shaders/fragment-shader.glsl",
                uniforms: {
                    map: {type: "t", value: "font"},
                    u_color: {value: "#ff0000"}
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
                        scale: {x: 255, y: 255}
                    }
                }
            }
        ]
    }
}