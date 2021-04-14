export const schema = {
    colors: [
        {
            id: "primary",
            color: "#ff0090"
        }
    ],
    materials: [
        {
            id: 0,
            type: "MeshBasicMaterial",
            args: {
                color: "primary"
            }
        }
    ],
    context: {
        type: "orthographic",
        args: {
            background: "#000000"
        }
    },
    scene: {
        elements: [
            {
                id: "rect",
                element: "PlaneGeometry",
                material: 0,
                args: {
                    transform: {
                        scale: {x: 200, y: 200},
                        position: {x: 0, y: 0, z:0},
                        rotation: {x: 0, y: 0, z:0}
                    }
                }
            }
        ]
    }
}

// program.setColor("primary", "#ff0000");
// program.setMaterialColor(0, "primary");
// program.setMaterialProperty(0, "color", "#ff00ff");

