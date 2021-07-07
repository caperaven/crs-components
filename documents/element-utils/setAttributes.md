# setAttributes

## Introduction
For a given element set the attributes of that element using a object literal where the property is the attribute and, the value the attribute value.

Parameters are

1. element (HTMLElement) - the element who's children to affect.
1. args (object) - attribute and values to set. See example.

This function is found in "/components/lib/element-utils.js"

## Example

```js
await setAttributes(svg, {
    "id": id,
    "viewBox": "0 0 24 24",
    "role": "button",
    "width": "32px",
    "height": "32px",
    "tabindex": "-1",
    "aria-label": "additional items"
})
```