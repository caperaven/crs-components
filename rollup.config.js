import { terser } from "rollup-plugin-terser";

export default[
    {
        input: "components/html-to-text/html-to-text.js",
        output: [
            { file: 'dist/components/html-to-text/html-to-text.js', format: 'es' },
        ],
        plugins: [
            terser()
        ]
    },
    {
        input: "components/monaco-editor/monaco-editor.js",
        output: [
            { file: 'dist/components/monaco-editor/monaco-editor.js', format: 'es' }
        ],
        plugins: [
            terser()
        ]
    }

]