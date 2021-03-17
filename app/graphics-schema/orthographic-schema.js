export const orthographicSchema = {
    requires: [
        "/components/orthographic-canvas/orthographic-canvas.js"
    ],
    context: {
        type: "orthographic",
        attributes: {
            background: "#ff0090"
        }
    },
    textures: [
        {
            id: "floor",
            texture: "path to texture"
        }
    ],
    materials: [
        {
            id: 0,
            type: "MeshBasicMaterial",
            parameters: {
                color: "#0000ff",
                map: "floor"
            }
        }
    ],
    scene: {
        elements: [
            {
                element: "PlaneGeometry",
                material: 0,
                transform: {
                    scale: {x: 200, y: 200},
                    position: {x: 0, y: 0, z:0},
                    rotation: {x: 0, y: 0, z:0}
                }
            }
        ]
    }
}