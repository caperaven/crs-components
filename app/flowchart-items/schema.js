export const schema = {
    colors: [
        {
            id: "red",
            color: "#ff0000"
        }
    ],
    materials: [
        {
            id: "red",
            type: "MeshBasicMaterial",
            args: {
                color: "red"
            }
        },
    ],
    context: {
        type: "perspective",
        args: {
            background: "#e8e8e8",
            position: {
                z: 5
            },
            allow_drag: true
        }
    },
    scene: {
        id: "scene",
        material: "red",
        elements: [
            {
                element: "flow-chart",
                shape: "action",
                args: {
                    transform: {
                        position: {x: 3}
                    }
                }
            },
            {
                element: "icon",
                shape: "fireExtinguisher"
            },
            {
                element: "icon",
                shape: "fireHose"
            },
            {
                element: "flow-chart",
                shape: "data"
            },
            {
                element: "flow-chart",
                shape: "decision"
            },
            {
                element: "flow-chart",
                shape: "delay"
            },
            {
                element: "flow-chart",
                shape: "document"
            },
            {
                element: "flow-chart",
                shape: "documents"
            },
            {
                element: "flow-chart",
                shape: "event"
            },
            {
                element: "flow-chart",
                shape: "inputOutput"
            },
            {
                element: "flow-chart",
                shape: "loopLimit"
            },
            {
                element: "flow-chart",
                shape: "manualInput"
            },
            {
                element: "flow-chart",
                shape: "manualOperations"
            },
            {
                element: "flow-chart",
                shape: "merge"
            },
            {
                element: "flow-chart",
                shape: "offPage"
            },
            {
                element: "flow-chart",
                shape: "predefinedProcesses"
            },
            {
                element: "flow-chart",
                shape: "preparation"
            },
            {
                element: "flow-chart",
                shape: "start"
            }
        ]
    }
}
