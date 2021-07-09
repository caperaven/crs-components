# Pass fail card

![piechart](/documents/images/pass-fail-card.jpg)

## Introduction

This component uses two bars to display pass values and fail values.  
Using two bars instead of one often makes it easier to display values without impeding on the text when the values are very low.

## Example
```html
<pass-fail-card data-title="Item Checked" data-pass="5" data-fail="3" data-passtext="Pass Text" data-failtext="Fail Text"></pass-fail-card>
```

Take note of the attributes.    
To enable better access for translations the title, pass text and fail text are defined as data- attributes.  
Additionally, the pass value and fail value are attribute based.  

Default pass text is "Similar".
Default fail text is "Different".

You can set the color to be used in the pass bar using `data-passcolor`.  
It will default to `#2ECC71` if not defined.  

You can set the color to be used in the fail bar using `data-failcolor`.  
It will default to `#E34B3B` if not defined.

## Location
/components/visualization/pass-fail-card/pass-fail-card.js