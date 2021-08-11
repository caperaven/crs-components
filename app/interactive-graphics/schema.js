export const schema = {
    layers: [
        {
            id: 0,
            title: "background",
            elements: [
                {
                    element: "PlaneGeometry",
                    material: "background",
                    args: {
                        transform: "p,0,0,0,s,200,200,1"
                    }
                }
            ]
        }
    ],

    context: {
        type: "orthographic",
        args: {
            background: "#e8e8e8",
            position: {
                z: 5
            },
            interactive: true
        }
    },

    scene: {
        elements: []
    }
}