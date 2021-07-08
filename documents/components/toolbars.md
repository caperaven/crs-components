# Toolbars

There are two types of toolbars.

1. Standard
1. Overflow

## Standard Example
```js
<div is="standard-toolbar" id="standard-toolbar">
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
</div>
```

The idea behind this toolbar is that it adds accessibility features to the toolbar.

## Standard example result
```js
<div is="standard-toolbar" id="standard-toolbar" role="toolbar" tabindex="0">
    <button aria-label="Button 1" tabindex="0">Button 1</button>
    <button aria-label="Button 2" tabindex="-1">Button 2</button>
    <button aria-label="Button 3" tabindex="-1">Button 3</button>
</div>
```

## Overflow Toolbar
Though the overflow toolbar adds accessibility it has one important additional feature.
On initial load or resize of browser window, any buttons that no longer fit on the toolbar will go into a overflow section and, an overflow button is added.
The overflow section is an [ul-list](https://github.com/caperaven/crs-components/blob/master/documents/components/lists.md#ul-example)

The overflow by default does not have a style.  
This affords you with a way to customize it to your look and feel.
The overflow has a class of "back" and "overflow-toolbar-ul" that you can style.
"back" is required so that if you click on empty space it will close.

<strong>The css for "back"</strong>
```css
.back:before {
    content: "";
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: transparent;
    z-index: -1;
}
```

<strong>overflow-toolbar-ul example</strong>
```css
.overflow-toolbar-ul {
    background: white;
    list-style: none;
    padding: 0.5rem;
    box-shadow: 0px 4px 14px rgb(0 0 0 / 25%);
    border: 1px solid #979797;
}
```

Similarly, it does not ship with the overflow image.
You will need to have a svg [symbols collection](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol).
This collection should have a symbol with id "ellipse"

## Location
/components/toolbars/standard-toolbar.js  
/components/toolbars/overflow-toolbar.js  