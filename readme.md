# CRS Components
## Introduction

This is a component library for crs applications

NOTE: this is still very much in progress.

## Requirements

This component library has some dependencies.
[crs-binding](https://github.com/caperaven/crs-binding) is assumed to exist in the project.  
You will need to install and load crs-binding in your project during startup.
In some cases like "monaco", requirejs is needed to handle amd modules.  
Requirejs is packaged with this library, so you don't need to install it.

## Components

1. html-to-text
2. crs-monaco-editor

### html-to-text
This component allows you to show html content in your document as text content so that you can safely display code on your page without it affecting the page's content

```html
<html-to-text src="/templates/html-example.html"></html-to-text>
```

### crs-monaco-editor
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

