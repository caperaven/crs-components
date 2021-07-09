# Percent bar

![piechart](/documents/images/percent-bar.jpg)

## Introduction

This is a simple component that shows three things.

1. Title - text on left
1. Value - text on right
1. Max Value - scaled bar width

## Example
```js
<percent-bar data-title="Asset Code 2" data-value="80" data-max="100" data-barcolor="#ff0090"></percent-bar>
```

The bar color defaults to "#9B59B6".  
You can set the css variable `--cl-bar` to change that.  
While on the subject of css variables, you can configure the component using these.

1. --cl-background (#D8D8D8);
1. --cl-bar (#9B59B6);
1. --cl-title (white);
1. --cl-value (black);

You can also set the bar color using the `data-barcolor` attribute.

## Location
/components/visualization/percent-bar/percent-bar.js