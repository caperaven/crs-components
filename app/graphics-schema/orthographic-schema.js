export const orthographicSchema = {
    requires: [
        "/src/components/orthographic-canvas/orthographic-canvas.js"
    ],
    context: {
        type: "orthographic",
        attributes: {
            background: "#dadada"
        },
        grid: {
            size: 10,
            divisions: 10,
            colorCenterLine: "#ff0000",
            colorGrid: "#888888"
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
                color: "#0000ff",
                linewidth: 5
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
                    {x: 100, y: 0, z: 0},
                    {x: 200, y: 100, z: 0},
                    {x: 200, y: -100, z: 0},
                    {x: 100, y: 0, z: 0},
                ]
            }
        ]
    }
}