export const perspectiveSchema = {
    requires: ["/src/components/perspective-canvas/perspective-canvas.js"],
    context: {
        type: "perspective",
        parameters: {
            position: {
                z: 5
            }
        },
        attributes: {
            background: "#ff9000"
        }
    },
    materials: [
        {
            id: 0,
            type: "MeshBasicMaterial",
            parameters: {
                color: "#ff0090"
            }
        }
    ],
    scene: {
        elements: [
            {
                element: "BoxGeometry",
                material: 0
            }
        ]
    }
}