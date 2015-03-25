---
layout: subpage
id: tutorial-custom-todo-provider
parent: tutorials
permalink: /tutorials/custom-todo-provider/
order: 4

title: "Custom To-do provider"
---
## Custom To-do content provider

This tutorial extends previous [Simple To-do tutorial]({{ site.baseurl }}/tutorials/simple-todo/).

As mentioned in previous tutorial few improvements can be made to our to-do application.

We should write our own content provider which encapsulates storing of data in localStorage and provides data manipulation functions such as **addTask**, **toggleTask** and **removeTask**.

So let's start.

### Creating custom provider

We want to have benefits of MetaJS's **ObservingProvider** so we will use it as prototype.

Add following code before Activity definition.

```javascript
var TodoProvider = function(storageId){

	//Call parent constructor
	Meta.ObservingProvider.call(this);

}

TodoProvider.prototype = Object.create(Meta.ObservingProvider.prototype);
```

We defined our provider's constructor which also calls "parent" constructor.

Then we set out provider's prototype to ObservingProvider's prototype so it's "inherits methods".

### Implement storage
Now we want to move loading and saving of todo's to provider.

Update provider code as follows.

```javascript
var TodoProvider = function(storageId){

	//Save storage ID
	this.storageId = storageId;

	//Call parent constructor
	Meta.ObservingProvider.call(this);

	//Load todo's
    if(localStorage[this.storageId])
        this.tasks = JSON.parse(localStorage[this.storageId]);
    else
        this.tasks = [];

}

TodoProvider.prototype = Object.create(Meta.ObservingProvider.prototype);

TodoProvider.prototype.save = function(){

	localStorage[this.storageId] = JSON.stringify(this.tasks);

};
```

#### Constructor
At first we save `storageId` to provider instance so `save` function can access it.

Then we call "parent" constructor.

And at the end we tries to load saved tasks the same way as we did in previous tutorial.

#### Save
We also added `save` function to provider's prototype which saves tasks to localStorage.

### Data manipulation
Now we will add **addTask**, **toggleTask** and **removeTask** functions which will do the same as in previous tutorial.

Add following code after `save` function.

```javascript
TodoProvider.prototype.addTask = function(name){

	this.tasks.unshift({
		task: name,
		completed: false
	})

	this.save();

};

TodoProvider.prototype.toggleTask = function(index){

	this.tasks[index].completed = !this.tasks[index].completed;
	this.save();

};

TodoProvider.prototype.removeTask = function(index){

	this.tasks.splice(index, 1);
	this.save();

};
```

### Modify activity
Now we can modify To-do activity to use our new provider.

Change provider name to `TodoProvider` and remove loading from localStorage. Function `onCreate` should looks as follows.

```javascript
onCreate: function(self){

    //Create provider
    self.provider = new TodoProvider("com.example.simpleTodo");

    //Set model
    self.model.tasks = self.provider.tasks;

},
```

Then we will modify our event bindings to use provider's functions instead of activity's.

```javascript
events: {
    "click #add": function(ev){

        var value = this.$.todo.value;

        if(value != ""){
            this.provider.addTask(value);
            this.$.todo.value = '';
        }

    },

    "click ul li": function(ev){

        this.provider.toggleTask(ev.sender.task);

    },

    "click ul li .remove": function(ev){

        ev.stopPropagation();
        this.provider.removeTask(ev.sender.parentElement.task);

    }
},
```

### Clean up
Finally we can remove old **save**, **addTask**, **toggleTask** and **removeTask** functions from activity.

Now our To-do application makes sense and looks really nice, isn't it?

See [Full index.html source code]({{ site.baseurl }}/tutorials/custom-todo-provider/code/) if you had any troubles.