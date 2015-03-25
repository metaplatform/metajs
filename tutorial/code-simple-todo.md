---
layout: page
id: code-simple-todo
parent: none
permalink: /tutorials/simple-todo/code/
order: 52

title: "Full source - Simple To-do"
heading: "Tutorials"
description: "Get started with MetaJS and build your first application."
---

## Simple To-do full source code

### index.html

```html
<!doctype html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>MetaJS Simple To-do app</title>

        <script type="text/javascript" src="metajs/dist/metajs.min.js"></script>
    </head>

    <body>

		<template is="meta-view" name="com.example.todo">

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

		<script type="text/javascript">
		    Meta.Activity("com.example.todo", {

		        view: "com.example.todo",

				binding: {
				    "ul li": $__repeat("tasks", {
				        "@":        [
				            $__attrIf("completed", "completed"),
				            $__prop("task", "@key")
				        ],
				        ".task":    "task"
				    })
				},

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

				onResume: function(self){

				    self.providerChanged = self.provider.on("changed", function(data){
				        self.render();
				    });

				},

				onPause: function(self){

				    self.provider.off(self.providerChanged);

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

		<meta-activity name="com.example.todo" auto></meta-activity>

    </body>
</html>
```