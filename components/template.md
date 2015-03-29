---
layout: subpage
parent: components
id: template
class: components
permalink: /components/template/
order: 2

title: "DOM Template"
heading: "DOM Template"
description: "Templating engine which manipulates directly with DOM"
icon: dev-code
top: true
---

## Overview
MetaJS templating engine provides data-binding, conditions and loops. It is dom-based which means that it manipulates directly with DOM without text-based re-rendering and re-parsing which provides high performance and flexibility.

### Usability & compatibility
MetaJS Template library can be used standalone and not depends on WebComponents specification so it works in most modern browsers. See [working demo](http://repo.meta-platform.com/metajs/demo/template-native.html).

Just include `dist/template.min.js`.

### Concept
Template engine processes DOM nodes by definition rules. Engine goes throught selectors and executes processing function for every node returned by selector.

Definition rules are specified by and object in format `"selector": processing_function`.

Purpose of each processing function is to modify DOM element.

## Quick example

### HTML

```html
<div id="tpl">
	<p class="project-name"></p>
	<p class="budget"></p>
	<p class="created"></p>
	<p class="active">ACTIVE</p>
	<p class="status"></p>
	<p class="manager">
		<span class="first-name"></span>
		<span class="last-name"></span>
	</p>

	<ul class="tasks">
		<li>
			<span class="task"></span>
			<span class="due-date"></span>
		</li>
	</ul>

	<div class="note"></div>
</div>
```

### JavaScript

```javascript
var tpl = Meta.Template(document.getElementById('tpl'), {
	".project_name":	"name",
	".budget":			$__string("$ #{budget}"),
	".created":			$__date("d. m. Y", "created"),
	".active":			$__if("active"),
	".status":			$__fn(function(data){
		switch(data.status){
			case 0: return "Concept";
			case 1: return "In progress";
			case 2: return "Closed";
		}
	}),
	".manager"			$__with("manager", {
		".first-name":		"first_name",
		".last-name":		"last_name"
	}),
	"ul.tasks":			$__repeat("tasks", {
		".task":			"task",
		".due-date":		$__date("d. m. Y", "due_date"),
		"@":				$__attrIf("completed", "complete")
	}),
	".note":			$__html("note")
});

tpl({
	name:		"My project",
	budget:		1000,
	created:	new Date(2015, 3, 20, 0, 0, 0, 0),
	active:		true,
	status:		1,
	manager:	{
		first_name: "John",
		last_name:	"Doe"
	},
	tasks:		[
		{
			task: "Write concept",
			due_date: new Date(2015, 3, 22, 0, 0, 0, 0),
			complete: true
		}, {
			task: "Consult with customer",
			due_date: new Date(2015, 3, 25, 0, 0, 0, 0),
			complete: false
		}
	],
	note: '<p>This will be fun!</p>'
});
```

### Result
```html
<div id="tpl">
	<p class="project-name">My project</p>
	<p class="budget">$ 1000</p>
	<p class="created">20. 3. 2015</p>
	<p class="active">ACTIVE</p>
	<p class="status">In progress</p>
	<p class="manager">
		<span class="first-name">John</span>
		<span class="last-name">Doe</span>
	</p>

	<ul class="tasks">
		<li>
			<span class="task" completed>Write concept</span>
			<span class="due-date">22. 3. 2015</span>
		</li>
		<li>
			<span class="task">Consult with customer</span>
			<span class="due-date">25. 3. 2015</span>
		</li>
	</ul>

	<div class="note">
		<p>This will be fun!</p>
	</div>
</div>
```

## Template reference

### Meta.Template(targetElement, binding={})
Parameter `targetElement` specifies root element on which bindings will be processed.

Parameter `binding` specifies definition rules in format `"selector": processingFunction`.

```javascript
var instance = Meta.Template(targetElement, binding);
```

### instance(data)
Parameter `data` specifies data values which will be passed to processing functions.

```javascript
instance(data);