# Vertical key navigation

## Introduction
This function enables vertical key navigation actions on a given element by listening to the Key Up event.  
This helps you implement web accessibility keyboard navigation.

When you press a given key it will try and execute function on the element.

| Key         | Function        |
| :---------- | :---------------|
| ArrowLeft   | collapse        | 
| ArrowRight  | expand          |
| ArrowDown   | gotoNext        |
| ArrowUp     | gotoPrevious    |
| Enter       | activate        |
| Space       | activate        |
| Home        | gotoFirst       |
| End         | gotoLast        |

If the function is not implemented on the element it will not be called.
This requires crs-binding and the target element must either be a [BindableElement](https://github.com/caperaven/crs-binding-documentation/blob/master/2.%20bindable-element.md#using) or should have [events enabled](https://github.com/caperaven/crs-binding-documentation/blob/master/12.api.md#enable-and-disable-dom-events).

## Example

```js
await enableVerticalKeys(element);
```

## Location
"/components/lib/vertical-key-navigation.js"