---
layout: subpage
parent: fragment
id: fragment-properties
permalink: /components/fragment-activity/properties/
order: 2

title: "Definition properties"
---

## Fragment definition properties

Fragment definition properties are used to configure fragment behaviour.

### **shadowRoot**: boolean

Specifies if to create Shadow root.

Default: true

### **import**: array of string

List of modules which should be imported before fragment is initialized.

See [Utilities / Import]({{ site.baseurl }}/components/utilities/) for module importing details.

### **extends**: array of string

Specifies list of other fragment from which definition will be merged.

Listed fragments must be imported or listed in `import` property or exception will be thrown.

**Example:**

```javascript
Meta.Fragment("com.example.a", {

	view: "com.example.a",

	model: {
		x: 1
	}

});

Meta.Fragment("com.example.b", {

	view: "com.example.b"

});

Meta.Fragment("com.example.c", {

	extends: ["com.example.a", "com.example.b"],
	shadowRoot: false

});
```

Fragment `com.example.c` definition will be:

```javascript
{
	view: "com.example.b",
	
	model: {
		x: 1
	},
	
	shadowRoot: false
}
```

### **model**: object

Default model object which will be bound to view's `model` property.

### **binding**: object

Template binding rules which will be passed to view's `instance` function.

### **events**: object

View event binding rules which will be bound to view's `events` property.

Note that view's `eventsContext` property is set to fragment instance.

### **onCreate**: function(self)

Function which will be called when fragment is created.

See [Fragment lifecycle]({{ site.baseurl }}/components/fragment-activity/lifecycle/) for more details.

### **onReady**: function(self)

Function which will be called when fragment is ready.

See [Fragment lifecycle]({{ site.baseurl }}/components/fragment-activity/lifecycle/) for more details.

### **onResume**: function(self)

Function which will be called when fragment is resumed.

See [Fragment lifecycle]({{ site.baseurl }}/components/fragment-activity/lifecycle/) for more details.

### **onPause**: function(self)

Function which will be called when fragment is paused.

See [Fragment lifecycle]({{ site.baseurl }}/components/fragment-activity/lifecycle/) for more details.

### **onRender**: function(self)

Function which will be called when fragment's view has been rendered.

## Custom methods
We can define fragment custom methods by defining them as functions in fragment definition.

These methods are exported to fragment element instance when it is created.

### Example
**Definition**

```javascript
Meta.Fragment("com.example.todo", {

	sayHello: function(name){
		alert("Hello " + name + "!");
	}

});
```

**HTML**

```html
<meta-fragment name="com.example.todo" id="my-fragment"></meta-fragment>
```

**Call custom method**

```javascript
document.getElementById('my-fragment').sayHello('world');
```

Be carefull about method naming beacause you can accidentally override default fragmentElement methods or other HTMLElement methods.