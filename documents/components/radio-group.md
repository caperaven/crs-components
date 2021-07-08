# Radio Group

## Introduction
This component helps you define radio groups quick and easily.  
In the example below we are using the crs-binding to pass values into and get values out of the group so, you know what was selected.
This is not required but, it makes life easier.

When the component's value changes it dispatches an event "valueChange"

## Example
```html
<radio-group value.two-way="model.selectedValue" data-name="group1">
    <radio title="Value: 10" value="10"></radio>
    <radio title="Value: 20" value="20"></radio>
    <radio title="Value: 30" value="30"></radio>
</radio-group>
```

You should as a rule provide the data-name attribute that sets the group name.  
Since this is required for radio groups, if you don't define a value, it will default to "group"

## Result

```html
<radio-group data-name="group1" role="radiogroup">
    <input type="radio" value="10" name="group1" id="group1_10">
    <label for="group1_10">Value: 10</label>
    <input type="radio" value="20" name="group1" id="group1_20">
    <label for="group1_20">Value: 20</label>
    <input type="radio" value="30" name="group1" id="group1_30">
    <label for="group1_30">Value: 30</label>
</radio-group>
```

As you can see in the result above, the id for each radio item is set to the group name + the value divided by "_"  
The title you set on radio becomes the label's value.

## Location
/components/radio-group/radio-group.js