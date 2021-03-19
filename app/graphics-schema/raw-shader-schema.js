export const rawShaderSchema = {
    requires: [
        "/src/components/orthographic-canvas/orthographic-canvas.js"
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
                    map: {type: "t", value: "font"}
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
                        scale: {x: 200, y: 200}
                    }
                }
            }
        ]
    }
}