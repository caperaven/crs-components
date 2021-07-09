# Percent bar group
![piechart](/documents/images/percent-bar-group.jpg)

# Introduction

You might have guessed that this is a group of percent-bar elements.

## Example

```html
<percent-bar-group data.one-way="data"></percent-bar-group>
```

You need to provide the data (array) that defines the different bars and their values.

```js
this.setProperty("data", [
    {
        title: "Running",
        value: 150,
        color: "#0276C2"
    },
    {
        title: "Complete",
        value: 75,
        color: "#FFBB00"
    },
    {
        title: "Aborted",
        value: 28,
        color: "#F97825"
    },
    {
        title: "Cancelled",
        value: 15,
        color: "#E00000"
    }
]);
```