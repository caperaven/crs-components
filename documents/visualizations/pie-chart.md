# Pie chart

![piechart](/documents/images/piechart.jpg)

## Introduction

This component requires crs-binding

This component renders a pie / donut chart and legend on the left.
You can also show summary content in the middle of the chart.

The default view is a donut chart with a center whole of `radius / 1.5`.
You can override this by setting the data-innerradius attribute.  
If you set the inner radius to 0, you have a pie chart.

You can determine the radius by setting the width using the data-width attribute.
You can also set the margin of the wheel using data-margin.  
The default margin is 16 px;  
The margin will affect the overall size of the wheel along with the width.

## Data

There are two data properties on the component.

1. data - array of items
1. summary - summary object - see summary section for more detail

The data collection objects should have three properties.

1. title
1. value
1. color

If you don't want to use those properties, you need to set the names on the pie-chart using.

1. data-colorfield
1. data-titlefield
1. data-valuefield

## Summary
This is the section that requires the binding engine.  
To define center showing content you define a template as a child of the chart.
The chart uses the inflationManager on the engine to populate the data.
Set the `summary` property of the chart with the data you want to use in the summary template.

## Example
```js
<pie-chart data.one-way="data" summary.one-way="summary" id="demo-pie" data-width="150" data-margin="8">
    <template>
        <div class="summary">
            <div class="count">${count}</div>
            <div class="title">${title}</div>
        </div>
    </template>
</pie-chart>
```

## Location
/components/visualization/pie-chart/pie-chart.js