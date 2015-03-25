---
layout: subpage
id: tutorial-simple-todo
parent: tutorials
permalink: /tutorials/simple-todo/
order: 2

title: "Simple To-do"
---
## Simple one-activity To-do application
In this tutorial we will create simple one-page / one-activity application for managing tasks.

User will be able to add tasks, mark tasks as complete / incomplete and remove tasks.

You can take look at [final result](http://repo.meta-platform.com/metajs/examples/simple-todo/).

### Create project
At first, create project directory and move to it.

```
mkdir simple-todo
cd simple-todo
```

Clone MetaJS repository or put minified version to `metajs/dist` subdirectory.

```
git clone https://github.com/metaplatform/metajs.git
```

Create `index.html` file.

```html
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>MetaJS Simple To-do app</title>

		<script type="text/javascript" src="metajs/dist/metajs.min.js"></script>
	</head>

	<body>

		...

	</body>
</html>
```

### Activity view
Now lets define our activity view. Adds following HTML to body instead of dots.

```html
<template is="meta-view" name="com.example.todo">

	<p>
		<input type="text" name="todo" id="todo" placeholder="Add to-do" />
		<button id="add">Add</button>
	</p>

	<ul>
		<li>
			<span class="task"></span>
			<button class="remove">X</button>
		</li>
	</ul>

</template>
```

We just created simple input and button to add a new todo and list of existing todos with remove button.

### Activity definition
Now we will define our activity. Add following code after view definition.

```html
<script type="text/javascript">
	Meta.Activity("com.example.todo", {

		view: "com.example.todo"

	});
</script>
```

Code registers new activity **com.example.todo** and we specified that activity should use **com.example.todo** view as we defined previously.

### Create provider and task methods
Replace activity script by following code.

```html
<script type="text/javascript">
	Meta.Activity("com.example.todo", {

		view: "com.example.todo",

		onCreate: function(self){

			//Create provider
			self.provider = new Meta.ObservingProvider();

			//Load saved tasks
			if(localStorage["com.example.todo.tasks"])
				self.provider.tasks = JSON.parse(localStorage["com.example.todo.tasks"]);
			else
				self.provider.tasks = [];

			//Set model
			self.model.tasks = self.provider.tasks;

		},

		save: function(){

			//Save tasks to local storage
			localStorage["com.example.todo.tasks"] = JSON.stringify(this.provider.tasks);

		},

		addTask: function(name){

			this.provider.tasks.unshift({
				task: name,
				completed: false
			})

			this.save();

		},

		toggleTask: function(index){

			this.provider.tasks[index].completed = !this.provider.tasks[index].completed;
			this.save();

		},

		removeTask: function(index){

			this.provider.tasks.splice(index, 1);
			this.save();

		}

	});
</script>
```

#### onCreate
We defined **onCreate** function which is called right after activity is initialized and before view. In this method we should create content providers.

We also tries to load saved tasks from local storage and set them to provider.

At the end we assigned tasks to activity model so they are accesible by view.

The **ObservingProvider** uses Object.observe and notifies us when any of it's properties has changed.

#### save
This function simply saves content provider data to local storage.

#### addTask
This function pushes new task object into content provider and saves changes to local storage.

#### toggleTask
This function simply inverts `completed` property and saves changes.

#### removeTask
This function removes task from array and then saves changes to local storage.

### View logic
Now add some view logic so our view can show tasks from content provider.

Add following code to activity definition right after `view: "com.example.todo",`.

```javascript
binding: {
	"ul li": $__repeat("tasks", {
		"@": 		[
			$__attrIf("completed", "completed"),
			$__prop("task", "@key")
		],
		".task": 	"task"
	})
},
```

Bindings are MetaJS template rules which specifies how data should be bound. It uses simple `selector: function` format.

`$__repeat` function says that all `ul li` elements should be repeated for every item in model's `tasks` array and processed by another rules.

Selector `@` means current element.

Function `$_attrIf` adds HTML attribute `completed` only if task property `completed` is positive (eg.: true / 1 / non empty).

Function `$__prop` assings current item index (`@key`) to `task` element's object attribute so we can reference it later.

At the end we defined that `task` property should be set to `.task` element's inner HTML.

### React on provider changes
Add folowing code after `onCreate` function.

```javascript
onResume: function(self){

	self.providerChanged = self.provider.on("changed", function(data){
		self.render();
	});

},

onPause: function(self){

	self.provider.off("changed", self.providerChanged);

},
```

#### onResume
This function is called when activity is ready and view has been initialized. We started to listing on provider changes so we can update view.

#### onPause
MetaJS supports activity lifecycle where all events should be un-binded when activity is paused. We stops following provider changes so we won't be updating our view when activity is not active anymore.

### Bind events
Add following code right after bindings.

```javascript
events: {
	"click #add": function(ev){

		var value = this.$.todo.value;

		if(value != ""){
			this.addTask(value);
			this.$.todo.value = '';
		}

	},

	"click ul li": function(ev){

		this.toggleTask(ev.sender.task);

	},

	"click ul li .remove": function(ev){

		ev.stopPropagation();
		this.removeTask(ev.sender.parentElement.task);

	}
},
```

Events object specifies which events should be automatically binded to view elements.

Property name specifies event name and selector.

#### Add
We can access `<input ... id="todo" ... />` via hashmap which references to all view elements indentified by ID attribute so we don't have to use complicated getElementById.

If value is not empty then we just call **addTask** function.

#### Toggle
When user clicks on `<li>` element we toggle item's `completed` state.

Notice how we are accessing task index. In binding we said that task's index should be binded to `<li>`'s property so now we can access it easily.

#### Remove
We just call **removeTask** function and pass task object.

We also call event's **stopPropagation** function to prevent toggling task state by previous event.

### Create activity
Until now we didn't see anything because we just registered activity but not created it.

So let's add following code at the end of our index before `</body>`.

```html
<meta-activity name="com.example.todo" auto></meta-activity>
```

We simply added Activity to our page.

Attribute `auto` means that activity should be automatically resumed so we don't have to do it manually.

**That's it! Try you first MetaJS application.**

### Adding some design
Our application looks really ugly! Let's add some style.

Add following content to view definition before `<p>` tag.

```html
<style>

	:host {
		display: block;
		width: 500px;
		margin: auto;
		margin-top: 50px;
		margin-bottom: 50px;
		font-family: sans-serif;
		font-size: 16px;
		line-height: 1.0;
	}

	p {
		display: flex;
	}

	#todo {
		flex-grow: 1;
		padding: 10px;
		border: 1px solid #cccccc;
		background: #ffffff;
		box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.15);
	}

	#add {
		padding: 0px 20px;
	}

	ul {
		list-style: none;
		padding-left: 0px;
	}

	ul li {
		background: #f0f0f0;
		padding: 8px;
		margin-bottom: 3px;
		line-height: 24px;
		cursor: pointer;
	}

	ul li:hover {
		background: #e0e0e0;
	}

	ul li[completed] .task {
		text-decoration: line-through;
	}

	ul li .remove {
		float: right;
		width: 24px;
		height: 24px;
		border-radius: 12px;
		border: 0px none;
		background: #cccccc;
		color: #666666;
		cursor: pointer;
		-webkit-transition: all 0.3s;
		transition: all 0.3s;
	}

	ul li .remove:hover {
		background: #ff0000;
		color: #ffffff;
	}

</style>
```

## Possible improvements
To simplify and improve our code we should write our own content provider which encapsulates storing of data in localStorage and provides data manipulation functions such as **addTask**, **toggleTask** and **removeTask**.

Continue to the next [Custom To-do provider tutorial]({{ site.baseurl }}/tutorials/custom-todo-provider/) to see how it can be made.

## That's it!
See [Full index.html source code]({{ site.baseurl }}/tutorials/simple-todo/code/) if you had any troubles.