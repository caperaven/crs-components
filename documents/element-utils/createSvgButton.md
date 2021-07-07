# createSvgButton

## Introduction
This function creates a svg marked as a button.  
It has an internal use element to display a svg symbol.  
The default width and height of the button is 32px and, the viewbox is 24px

It has the following parameters

1. name (string) - svg symbol id to use in the use element
1. id (string) - id value to use for the button
1. hasPopup (boolean - default true) - indicates if the button shows a popup.

This function is found in "/components/lib/element-utils.js"  

If you are looking something similar to use inside a clickable surface you can use (createSvgImage)[https://github.com/caperaven/crs-components/blob/master/documents/element-utils/createSvgImage.md]