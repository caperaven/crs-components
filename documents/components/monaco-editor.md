# crs-monaco-editor
This component wraps the monaco editor allowing you to easily use it in your projects.  
All the loading drama is taken care of for you.

This component expects monaco to exist in node_modules.

```html
<crs-monaco-editor></crs-monaco-editor>
```

Attributes for this component are:

1. show-minimap {boolean}
1. language {string} default "javascript"
1. theme {string} default monaco default theme

To display your text content in the editor, set the component's value property to your content.

```js
document.querySelector("crs-monaco-editor").value = "my text content";
```

You can also use the compare function to put the editor in compare mode and show the differences.

```js
await document.querySelector("crs-monaco-editor").compare("Hello World", "Hello there World", "text/plain");
```

The parameters are:
1. original
2. modified
3. language // if not set it uses the editor's set language

## Location
"/components/monaco-editor/monaco-editor.js"