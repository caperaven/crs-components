# showElementRelativeTo

## Introduction 
This function places an element relative to another element.  
This function is found in "/components/lib/element-utils.js"  

The css position is set to "fixed".

## Parameters

1. parentElement (HTMLElement) - the element determining the position
1. element (HTMLElement) - the element to fix the position
1. location (string) - "top", "bottom", "left", "right"
1. screenPadding (number) - How many pixels from the edge of the screen must the element be.

## Example 

```js
const parent = document.querySelector(`#parent`);
const target = document.querySelector("#target");
await showElementRelativeTo(parent, target, "bottom", 16);
```

## Helper functions

This function makes use of other helper functions you can use directly.  
They are also found in element-utils.js
Place a defined element left, right, top or bottom of the parent element with the appropriate padding applied.

```js 
await placeLeft(parentElement, element, padding);
```
```js
await placeRight(parentElement, element, padding);
```
```js
await placeTop(parentElement, element, padding);
```
```js
await placeBottom(parentElement, element, padding);
```
   
The parameters for the above functions are, parentElement, element, padding.  
See showElementRelativeTo parameters for details.   

1. ensureOnScreen - make sure the element as a whole is still on screen.

The parameters are:

1. element - element to check
1. screenPadding - padding to enforce on screen border

```js
await ensureOnScreen(element, 16);
```