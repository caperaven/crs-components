export const orthographicSchema = {
    locations: {
        "src": "/src"
    },
    requires: [
        "orthographic-canvas"
    ],
    context: {
        type: "orthographic",
        args: {
            background: "@context.background"
        }
    },
    textures: [
        {
            id: "font",
            texture: "/fonts/opensans/OpenSans-Bold.png",
            args: {
                wrapS: "RepeatWrapping",
                wrapT: "RepeatWrapping",
                repeat: {x: 2, y: 2}
            }
        }
    ],
    materials: [
        {
            id: 0,
            type: "MeshBasicMaterial",
            args: {
                map: "font"
            }
        },
        {
            id: 1,
            type: "LineBasicMaterial",
            args: {
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
                args: {
                    transform: {
                        scale: {x: 200, y: 200},
                        position: {x: 0, y: 0, z:0},
                        rotation: {x: 0, y: 0, z:0}
                    }
                }
            },
            {
                element: "LineGeometry",
                material: 1,
                args: {
                    points: [
                        {x: 0, y: 0, z: 0},
                        {x: 100, y: 0, z: 0},
                        {x: 200, y: 100, z: 0},
                        {x: 200, y: -100, z: 0},
                        {x: 100, y: 0, z: 0},
                    ]
                }
            }
        ]
    },
    extensions: [
        {
            file: "@locations.src/graphics-helpers/graphics-input-manager",
            enable: {
                call: "enableInputManager",
                parameters: ["@context.canvas", ["mouse-move"]]
            },
            disable: {
                call: "disableInputManager",
                parameters: ["@context.canvas"]
            },
            selectionCallback: "@context.itemSelected"
        }
    ]
}