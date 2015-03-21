# MetaPlatform's metaJS UI Framework
MetaJS is pack of libraries which provides UI building blocks using web-components and HTML5 features.

## Warning
MetaJS is using experimental HTML5 WebComponent features which are not part of living standard and is not fully suported by web browsers.

**MetaJS currently works only in Google Chrome.**

**Required features:**
- Custom elements
- HTML imports
- HTML templates
- Shadow DOM
- Object.observe

Maybe some polyfill library can help, but not tested yet.

MetaJS is in early stage of development, API may change.

## metaJS components

### Template
Pure JavaScript DOM templating.

### View
View is wrapper for reusable metaJS templates and provides dynamic event-binding

### Fragment
Fragment is basic reusable UI block which is using Views and adds a view logic.  
Example usage: header, toolbar, search box, list view, etc...

### Activity
Activity extends fragment and provides top UI element for specific user-experience.  
Example usage: customer list, customer detail, user account, etc...

### Utilities
Usefull utility functions which are used by other MetaJS components.

### Example
```
+-------------------------------------------------------+
| Activity: Customer list                               |
|                                                       |
| +---------------------------------------------------+ |
| | Fragment: Toolbar / View: Toolbar                 | |
| +---------------------------------------------------+ |
| |                                                   | |
| | Fragment: ListView / View: ListView               | |
| |                                                   | |
| +---------------------------------------------------+ |
+-------------------------------------------------------+
```

# Component reference

## Template
DOM templating engine uses simple `"selector": processingFunction()` pattern.

Processing function has element as `this` context and receives `context` parameter where data and meta values are passed.

Processing function can also run another processing scope.

### Usage example

**HTML template**
```html
<div id="my-template">
	<div id="idVar">-</div>
	<p class="classVar">-</p>
	<p class="concat">-</p>
	 
	<ul class="items result-list">
	    <li>
	        <em class="date"></em> / 
	        <span class="key">key</span>
	        <span class="value">value</span>
	    </li>
	</ul>
	 
	<p class="random">Random state <strong>?</strong> is > 0</p>
	 
	<div class="data">Data container</div>
</div>
```

**JS template definition**
```javascript
var model = {
    idVar: "Content by > element ID (1)",
    classVar: "Content by element class (1)",
    items: [
        { key: "Key X", value: "Value X", completed: 0, date: new Date() },
        { key: "Key Y", value: "Value Y", completed: 0, date: new Date() }
    ],
    random: 1,
    data: { key: "value" }
}

var tpl = Meta.Template(document.getElementById('my-template'), {
    "#idVar": "idVar",
    ".classVar": $__fn(function(ctx){ return ctx.classVar.toUpperCase(); }),
    ".concat": $__string("#{idVar} + #{classVar}"),
    ".data": $__with("data", {
        "@": [
            "key",
            $__prop("data"),
            $__attr("my-attribute", function(ctx){ return ctx["@parent"].random; }),
            $__attrIf("random", "@parent.random", true)
        ]
    }),
    ".random": $__ifGt("random", 0, {
        "strong": "random"
    }),
    ".items li": $__repeat("items", {
        ".key": "key",
        ".value": "value",
        "@": [
            $__attrIf("completed", "completed", true)
        ],
        ".date": $__if("date", {
            "@": $__filter("date", "date")
        })
    })
});

Meta.Template.registerFilter("date", function(value){
    return value.getDate() + ". " + (value.getMonth() + 1) + ". " + value.getFullYear();
});

function render(){
    tpl(model);
}
```

### Function reference

`Meta.Template(target, definition)`
Creates template instance on target element by definition.

`instance(context)`
Processes template with specified `context` (data / model).

**Key parameter**
Parameter `key` in following reference specifies context value.

Parameter can be string with dot notation (for example: `customer.addresses.0.street`) or function which returns value.

#### Content
`window.$__html(key)`  
Sets element innerHTML to raw context value

`window.$__text(key)`  
Sets element innerHTML to sanitized context value

`window.$__string(string)`  
Sets element innerHTML to string defined by parameter. Parameter is string where `#{key}` is replaced by context value.

`window.$__fn(fn)`  
Sets element innerHTML to value returned by specified function. Specified function accepts `context` as first parameter and `this` as current element.

`window.$__filter(name, key)`  
Sets element innerHTML to context value filtered by global filter - see filters below.

#### Attributes and properties
**window.$__attr(name, key)**  
Sets element attribute specified by `name` to context value.

**window.$__attrIf(name, key, single)**  
Sets element attribute specified by `name` to context value only if value is positive. If `single` is set to true, attribute will be added without value.

**window.$__prop(name, key)**  
Sets element object property to context value.

#### Conditions
Adds or removes element if conditions is satisfied.

Definition parameter defines another rules which will be processed on child nodes when condition is satisfied.

**window.$__if(key, definition = {})**  
If context value is positive.

**window.$__ifNot(key, definition = {})**  
If context value is negative.

**window.$__ifLt(key, value, definition = {})**  
If context value is lower then reference value.

**window.$__ifLte(key, value, definition = {})**  
If context value is lower or equal to reference value.

**window.$__ifGt(key, value, definition = {})**  
If context value is lower then reference value.

**window.$__ifGte(key, value, definition = {})**  
If context value is lower or equal to reference value.

#### Loops
**window.$__repeat(key, definition = {})**  
Repeats nodes specified by selector for each item in context value.

Definition parameter defines another rules which will be processed on every repeated element.

#### Scopes
**window.$__with(key, defintion = {})**  
Processes rules defined by definition where `context` is set to specified current `context` value.

# Demo
See **demo** directory for working examples and advanced usage.

Demos are also available on: [MetaJS on MetaPlatform's repository](http://repo.meta-platform.com/metajs/demo/)

## Example apps
Todo-list is available in **examples** directory or [Todo-list on MetaPlatform's repository](http://repo.meta-platform.com/metajs/examples/todo-list/)

# Build
```
npm install
gulp [lib|clean]
```

# TO-DO
- Meta-services API client
- Messaging system (subscribe / publish pattern)
- Content providers (for API types)
- Activity / Fragment modal dialogs

# License
MetaJS is licensed under MIT license - see [LICENSE.md](./LICENSE.md)

Copyright (c) Jiri Hybek, jiri.hybek@cryonix.cz
