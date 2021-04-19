export const schema = {
    colors: [
        {
            id: "text",
            color: "#ff0090"
        }
    ],
    fonts: [
        {
            id: "Open-Sans",
            font: "/fonts/open-sans/OpenSans-Regular.json",
            fragment: "/shaders/msdf.frag"
        }
    ],
    context: {
        type: "orthographic",
        args: {
            background: "#e8e8e8"
        }
    },
    scene: {
        elements: [
            {
                element: "Text",
                font: "Open-Sans",
                text: "Hello World",
                color: "text",
                size: 42
            }
        ]
    }
}

