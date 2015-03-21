# metaJS - DOM templates

DOM templating engine uses simple `"selector": processingFunction()` pattern.

Processing function has element as `this` context and receives `context` parameter where data and meta values are passed.

Processing function can also run another processing scope.

## Usage example

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

## Function reference

```javascript
Meta.Template(target, definition)
```  
Creates template instance on target element by definition.

```javascript
instance(context)
```  
Processes template with specified `context` (data / model).

**`key` parameter**  
Parameter `key` in following reference specifies context value.

Parameter can be string with dot notation (for example: `customer.addresses.0.street`) or function which returns value.

**`definition` parameter**
Definition parameter in following reference defines another rules which will be processed on child nodes.

### Content

#### `$__html(key)`
Sets element innerHTML to raw context value

```javascript
var tpl = Meta.Tempate(target, {
	"p.first_name": $__html("first_name"),
});
```

#### `$__text(key)`
Sets element innerHTML to sanitized context value

```javascript
var tpl = Meta.Tempate(target, {
	"p.first_name": $__text("first_name"),
});
```

#### `$__string(string)`
Sets element innerHTML to string defined by parameter. Parameter is string where `#{key}` is replaced by context value.

```javascript
var tpl = Meta.Tempate(target, {
	"p.full_name": $__html("#{first_name} #{last_name}"),
});
```

#### `$__fn(fn)`
Sets element innerHTML to value returned by specified function. Specified function accepts `context` as first parameter and `this` as current element.

```javascript
var tpl = Meta.Tempate(target, {
	"p.date": $__fn(function(context){
		return context.date.toString()
	}),
});
```

#### `$__filter(name, key)`
Sets element innerHTML to context value filtered by global filter - see filters below.

```javascript
var tpl = Meta.Tempate(target, {
	"p.last_name": $__filter("uppercase", "last_name"),
});
```

### Attributes and properties

#### `$__attr(name, key)`
Sets element attribute specified by `name` to context value.

```javascript
var tpl = Meta.Tempate(target, {
	"#menu": $__attr("opened", "ui.menu.opened"),
});
```

#### `$__attrIf(name, key, single)`
Sets element attribute specified by `name` to context value only if value is positive. If `single` is set to true, attribute will be added without value.

```javascript
var tpl = Meta.Tempate(target, {
	"#menu": $__attrIf("opened", "ui.menu.opened", true),
});
```

#### `$__prop(name, key)`**  
Sets element object property to context value.

```javascript
var tpl = Meta.Tempate(target, {
	"meta-fragment#todo-list": $__prop("model", "todos"),
});
```

### Conditions
Adds or removes element based on condition.

#### `$__if(key, definition = {})`
If context value is positive.

```javascript
var tpl = Meta.Tempate(target, {
	".supplier": $__if("supplier", {
		".name": "name"
	}),
});
```

#### `window.$__ifNot(key, definition = {})`
If context value is negative.

#### `window.$__ifLt(key, value, definition = {})`
If context value is lower then reference value.

```javascript
var tpl = Meta.Tempate(target, {
	".items": $__ifLt("supplier", 0, {
		".name": "name"
	}),
});
```

#### `window.$__ifLte(key, value, definition = {})`
If context value is lower or equal to reference value.

#### `window.$__ifGt(key, value, definition = {})`
If context value is lower then reference value.

#### `window.$__ifGte(key, value, definition = {})`
If context value is lower or equal to reference value.

### Loops
#### `window.$__repeat(key, definition = {})`
Repeats nodes specified by selector for each item in context value.

Definition parameter defines another rules which will be processed on every repeated element.

```javascript
var tpl = Meta.Tempate(target, {
	".customer": $__repeat("customers", {
		".first_name": "first_name",
		".last_name": "last_name",
	}),
});
```

### Scopes
#### `window.$__with(key, defintion = {})`
Processes rules defined by definition where `context` is set to specified current `context` value.

```javascript
var tpl = Meta.Tempate(target, {
	".supplier": $__with("supplier", {
		".first_name": "first_name",
		".last_name": "last_name",
	}),
});
```