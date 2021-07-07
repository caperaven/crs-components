# createSvgImage

## Introduction
This function creates a svg element to show a symbol image.  
The pointer event is disabled so, it is not a clickable surface.

If you want a clickable surface rather use (createSvgButton)[https://github.com/caperaven/crs-components/blob/master/documents/element-utils/createSvgButton.md].

This function is found in "/components/lib/element-utils.js"  

The parameters are:

1. name - svg symbol id to use 
1. className - any css class name you want to add to the svg's classList

## Example

```js
const image = await createSvgImage("icon_name", "large");
```