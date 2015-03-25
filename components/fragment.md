---
layout: subpage
id: fragment
parent: components
class: components
permalink: /components/fragment-activity/
order: 6

title: "Fragment & Activity"
heading: "Fragment"
description: "Fragment and activity are using View and representing re-usable UI components."
icon: fragment
top: true
---

## Fragment & Activity component
Fragment and activity components are using View and representing re-usable UI components.

Activity component is same as Fragment but its definition is registered in `activities` array.

### Fragment definition example

```javascript
Meta.Fragment("com.example.todo", {

	//If to create shadow-root (default: true)
    shadowRoot: true,

	//Default view
    view: "com.example.todo",

    //Required modules to be imported
    import: ["example-list"],

    //Extends other fragments (inherit their definition)
    extends: ["com.example.list"],

    //View template bindings
    binding: {
        "ul li": $__repeat("tasks", {
            "@":        [
                $__attrIf("completed", "completed"),
                $__prop("task", "@key")
            ],
            ".task":    "task"
        })
    },

    //View event bindings
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

    //onCreate custom handler
    onCreate: function(self){

        //Create provider
        self.provider = new TodoProvider("com.example.simpleTodo");

        //Set model
        self.model.tasks = self.provider.tasks;

    },

	//onResume custom handler
    onResume: function(self){

        self.providerChanged = self.provider.on("changed", function(data){
            self.render();
        });

    },

	//onPause custom handler
    onPause: function(self){

        self.provider.off("changed", self.providerChanged);

    },

	//onRender custom handler
    onRender: function(self){

    	console.log("Rendered");

    }

});
```

### Fragment usage example

```html
<meta-fragment name="com.example.todo" auto></meta-fragment>
```