# Lists

## Introduction
There are two types of lists, ordered and unordered.  
This is nothing new, what it requires is accessibility features such as keyboard navigation.

## UL example

```html
<ul is="ul-list" id="unordered-list" data-persist="true">
    <li>List Item 1</li>
    <li>List Item 2</li>
    <li>List Item 3</li>
</ul>
```

## OL example

```html
<ol is="ol-list" id="ordered-list">
    <li>List Item 1</li>
    <li>List Item 2</li>
    <li>List Item 3</li>
</ol>
```

## Persist

If you set the data-persist attribute to true, it remembers where in the list you were.  
When you leave the list and come back to it, the item it will focus first will be the item you were on last.

## Location
/components/lists/ordered-list.js
/components/lists/unordered-list.js