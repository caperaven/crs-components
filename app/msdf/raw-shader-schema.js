export const rawShaderSchema = {
    requires: [
        "orthographic-canvas"
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
            //texture: "/app/msdf/output.png",
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
                    distanceFactor: {value:6}
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
                        scale: {x: 1024, y: 512}
                    }
                }
            }
        ]
    }
}