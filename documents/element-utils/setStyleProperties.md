# setStyleProperties

## Introduction
For a given element set the style of that element using an object literal where the property is the style and, the value the style value.

Parameters are

1. element (HTMLElement) - the element who's children to affect.
1. args (object) - style and values to set. See example.

This function is found in "/components/lib/element-utils.js"

## Example

```js
await setStyleProperties(element, {
    "background": "blue",
    "color": "white"
})
```