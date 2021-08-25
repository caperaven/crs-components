export const schema = {
    colors: [
        {
            id: "blue",
            color: "#0000ff"
        }
    ],

    materials: [
        {
            id: "blue",
            type: "MeshBasicMaterial",
            args: {
                color: "blue"
            }
        }
    ],

    context: {
        type: "orthographic",
        args: {
            background: "#e8e8e8",
            position: {
                z: 5
            },
            interactive: true,
        }
    },

    scene: {
        elements: []
    }
}