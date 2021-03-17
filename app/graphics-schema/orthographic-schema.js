export const orthographicSchema = {
    requires: [
        "/components/orthographic-canvas/orthographic-canvas.js"
    ],
    context: {
        type: "orthographic",
        attributes: {
            background: "#dadada"
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
                color: "#ff0090"
            }
        },
        {
            id: 1,
            type: "LineBasicMaterial",
            parameters: {
                color: "#ff0000"
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
            },
            {
                element: "LineGeometry",
                material: 1,
                points: [
                    {x: 0, y: 0, z: 0},
                    {x: 400, y: 400, z: 0}
                ]
            }
        ]
    }
}