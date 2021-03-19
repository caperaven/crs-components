export const perspectiveSchema = {
    requires: ["/src/components/perspective-canvas/perspective-canvas.js"],
    context: {
        type: "perspective",
        args: {
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
            args: {
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