export const perspectiveSchema = {
    requires: ["perspective-canvas"],
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