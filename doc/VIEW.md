# metaJS - View

View is wrapper for reusable MetaJS templates and provides dynamic event bindings.

## Example usage

**View definition**

```html
<template is="meta-view" name="com.example.myView">

	<p>This is meta-view template content where X = <span class="x">?</span></p>
	
	<p>
		<button>Try to click me!</button>
	</p>
	
</template>
```

**Using view**

```javascript
//Get view
var view = document.querySelector('template[name="com.example.myView"]');

//Define DOM target & create view instance
var target = document.getElementById('dom-render');

var instance = view.instance(target, {
	".x": "x"
});

//Initialize model
instance.model.x = 0;

//Bind events
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

## View element reference

### Attributes

#### `name`
If `name` attribute is set, view is added to global registry and can be accessed via name-reference.

```javascript
var instance = Meta.views["com.example.myView"].instance(target, binding);
```

### Methods

#### `instance(target = null, binding = {})`
Creates view instance

## View instance reference

### Properties
- `template` - Meta.Template instance
- `model` - View data model object
- `events` - View events definition
- `eventsContext` - `this` context for event handlers, by default view istelf

### Methods

#### `configure(target, binding)`
Sets view template target and bindings.

Calling this methods removes all child nodes of target element.

#### `on(name, selector, handler)`
Shorthand for event bindings.

- `name` - event name
- `selector` - which elements to bind
- `handler` - handler `function(event)`

#### `render()`
Renders view template

Throws error if view hasn't been configured via providing `target` and `binding` params or by calling `configure` method.