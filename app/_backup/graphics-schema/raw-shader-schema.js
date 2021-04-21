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
            texture: "/images/blur-barcode.png"
        }
    ],
    materials: [
        {
            id: 0,
            type: "RawShaderMaterial",
            transparent: true,
            uniforms: {
                map: {type: "t", value: "font"},
                fill: {value: "#ff0090"},
                stroke: {value: "#000000"},
                strokeWidth: {value: 2},
                distanceFactor: {value:1.5},
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