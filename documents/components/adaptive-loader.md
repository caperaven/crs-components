# Adaptive loader

## Introduction
This component relies on crs-binding.

Adaptive layout is used to cater for different devices, mobile and desktop.  
When you can't flow the UI responsively, you need to design a UI optimized for the mobile and desktop form factor.
Media queries are great when the actual browser size changes but what do you do when you have a container on screen that changes size.

Let's say we have a dialog container that acts as a parent for other content.  
When a user resizes the dialog container you want the content inside to change between a desktop or mobile type layout because the space afforded to it is of that size.

This component allows you to do that.

## Loading methods

There are two loading methods:

1. From html file - hardcoded html files on disk that you can load.
1. From schema - the html is generated at runtime and, you need to provide it.

### From HTML Example

```html
<adaptive-loader
    data-context.attr="contextId"
    data-property="data"
    data-folder.attr="folder"
    data-desktop="views/desktop.html"
    data-mobile="views/mobile.html">
</adaptive-loader>
```

1. data-context - what is the context id that must be used for binding operations
1. data-folder - what is the folder used to load the items defined in data-desktop and data-mobile
1. data-desktop - relative to the folder what file must be loaded when the device target is desktop
1. data-mobile - relative to the folder what file must be loaded when the device target is mobile
1. data-property - when performing the binding we need to call the updateUI function. What property must be used during this call.

As you can see in the above example, we set the folder via the binding engine.
You can hard code it but if you do use the binding engine, on the view model you can set it like this.

```js
this.setProperty("folder", import.meta.url.replace("view.js", ""));
```

### From Schema Example
```html
<adaptive-loader
    id="schema-loader"
    data-context.attr="contextId"
    data-property="data"
    data-schema="workorder:create">
</adaptive-loader>
```

1. data-context - same as above
1. data-property - same as above
1. data-schema - the schema markup that must be sent during the event aggregation. The markup does not matter, it's just a string that you can make sense of.

You will need to handle the event `adaptive-schema` on the event emitter.

```js
// at view setup
this._getSchemaHandler = this._getSchema.bind(this);
await crsbinding.events.emitter.on("adaptive-schema", this._getSchemaHandler);

// function
async _getSchema(event) {
    // event.context is the value you set on the data-schema attribute
    const html = getHTMLFromServer(event.device, event.context);
    event.callback(html);
}
```

## Triggering an update
There are two ways you can trigger an update on the adaptive-loader:

1. Set the width property to the new width
1. Use postMessage

## postMessage example
```js
crsbinding.events.emitter.postMessage("adaptive-loader", {
    action :"resize",
    width  : event.target.value
});
```