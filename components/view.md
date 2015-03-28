---
layout: subpage
parent: components
class: components
permalink: /components/view/
order: 4

title: "View"
heading: "View"
description: "View is wrapper for templates and adds view-logic."
icon: dev-screen
---

## View component

View defines reusable HTML template for each activity and fragment or can be used standalone.

View component extends html `template` tag which is not rendered and parsed until instanced.

View component also supports dynamic event-binding so when view is rendered all defined events are bound to template elements.

### Defining view
```html
<template is="meta-view" id="my-template">

    <p>This is meta-view template content where X = <span class="x">?</span></p>

    <button>Increment X</button>

</template>

<div id="target"></div>
```

### Using view
```javascript
var view = document.getElementById('my-template');
var target = document.getElementById('target');

//Create instance and define template rules
var instance = view.instance(target, {
    ".x": "x"
});

//Set model values
instance.model.x = 0;

//Bind event
instance.on("click", "button", function(){
    this.model.x++;
    this.render();
});

//Or bind events like this
instance.events = {
    "click button": function(){
        this.model.x++;
        this.render();
    }
}

//Do the first render
instance.render();
```

## Element **meta-view** reference
Element `meta-view` defines view component.

### Attributes

#### name="string"
When `name` attribute is set then view is registered globaly and can be access by it's name.

```html
<template is="meta-view" name="com.example.view">
	...
</template>
```

```javascript
var instance = Meta.views["com.example.view"].instance(target, {]);
```

### Methods

#### instance(targetElement, binding={})
Instance method materializes template and returns new view instance.

Parameters `targetElement` and `binding` are passed to [DOM templating engine]({{ site.baseurl }}/components/template/).

## View instance reference

### Properties

#### instance.target (read-only)
Template target element specified when creating instance.

#### instance.template
DOM templating engine instance.

#### instance.model
Model object containing data which are passed to template instance when rendering view.

#### instance.events
Object containing events definition for auto-binding.

Property name is string in format `eventName selector`.

Property value is event handler.

**Example:**

```javascript
{
	"click button.increment": function(ev){
		this.model.x++;
	}
}
```

Event handler accepts one parameter - Event object.

Event object also has a `sender` property set to an element on which event has been bound.

#### instance.eventsContext
Object which is passed to event handlers as `this` context variable.

#### instance.$
Elements ID hashmap of view's template child elements.

Hashmap is available after first render.

**HTML example**

```html
<div id="first-name">...</div>
<div id="last-name">...</div>
```

**Hashmap example**

```javascript
{
	"first-name": <div id="first-name">...</div>,
	"last-name": <div id="first-name">...</div>
}
```

### Methods

#### instance.materialize(targetElement, binding={})

Re-creates view's template instance.

This function is called automatically if **targetElement** and **bindings** arguments are set in instance constructor.

This function should be manually called only once and in case where we don't know target and binding when creating instance.

#### instance.on(eventName, selector, handler)

Adds event handler for elements specified by `selector` to instance's `events` property.

#### instance.render()

Renders template.

Throws error if view has not been materialized yet.