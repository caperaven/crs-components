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

## Helper functions

This function makes use of other helper functions you can use directly.  
They are also found in element-utils.js
Place a defined element left, right, top or bottom of the parent element with the appropriate padding applied.

1. placeLeft
1. placeRight
1. placeTop
1. placeBottom
   
The parameters for the above functions are, parentElement, element, padding.  
See showElementRelativeTo parameters for details.   

1. ensureOnScreen - make sure the element as a whole is still on screen.

The parameters are:

1. element - element to check
1. screenPadding - padding to enforce on screen border