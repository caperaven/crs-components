# Main Menu

## Introduction
The purpose of this component is to enable accessibility to navigation.

## Example
```html
<nav id="example-nav" aria-label="example navigation">
    <ol is="main-menu" changed.call="menuChanged($event)" id="example-nav-list">
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
    </ol>
</nav>
```

## Result 
```html
<nav id="example-nav" aria-label="example navigation">
    <ol is="main-menu" id="example-nav-list" role="menu" tabindex="0">
        <li tabindex="-1" role="menuitem" aria-current="page">Menu Item 1</li>
        <li tabindex="-1" role="menuitem">Menu Item 2</li>
        <li tabindex="-1" role="menuitem">Menu Item 3</li>
    </ol>
</nav>
```

## Location
/components/main-menu/main-menu.js