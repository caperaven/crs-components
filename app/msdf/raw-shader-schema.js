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
            texture: "/src/msdf/open-sans/OpenSans-Regular.png",
            args: {
                minFilter: "LinearFilter",
            }
        }
    ],
    materials: [
        {
            id: 0,
            type: "RawShaderMaterial",
            args: {
                fragmentShader: "/app/msdf/shaders/fragment-shader.glsl",
                transparent: true,
                uniforms: {
                    map: {type: "t", value: "font"},
                    fgColor: {value: "#ff0090"},
                    distanceFactor: {value: 1.5}
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
                        scale: {x: 256, y: 128}
                    }
                }
            }
        ]
    }
}