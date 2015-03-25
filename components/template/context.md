---
layout: subpage
parent: template
id: template-context
permalink: /components/template/key-context-scope/
order: 10

title: "Key, context & scope"
---

## Key parameter

Almost every processing function accepts `key` parameter.

### String key
Key specifies path to context's value and accepts dot notation.

**Example context:**

```javascript
{
	data: {
		customer: {
			first_name: "John",
			last_name:	"Doe"
		}
	},
	parent: ...parent context...
}
```
#### Context data-values
By default `data` properties are accessed by string key.

To access customer's first name we can use key `customer.first_name`.

```javascript
var tpl = Meta.Template(target, {
    "p.first_name": $__text("customer.first_name"),
});
```

#### Context meta-values
If we want to access context's meta-data, eg. 'parent' we must prefix key with '@' sign.

```javascript
var tpl = Meta.Template(target, {
    "ul li": $__repeat("customers", {
    	".info": $__with("contact", {
    		"@":			$__prop("index", "@parent.key"),
    		".custmer-id":	"@parent.data.customer_id",
    		".first-name":	"first_name",
    		".last-name":	"last_name"
    	})
	}
});
```

### Function key

Parameter `key` also can be a function returning a value.

User-function accepts context's `data` property as first parameter and entire context as second parameter.

Variable `this` is set to current element.

```javascript
var tpl = Meta.Template(target, {
    "p.name": $__text(function(data, ctx){
    	return data.name;
    }),
});
```

## Context

Each processing function accepts only one parameter - `context`.

Context is object containing data-values and meta-values.

Data values are received when rendering template and are set to `data` meta-value.

Meta values are used for internal workflow and to provide usefull scope variables such as index when iterating over an array.

Processing function which work with scopes (`$__repeat`, `$__with`, etc...) creates new context and provides child data and reference to parent context.

### Root context example
Example of first-level context which is available for root selectors.

```javascript
{
	data: {
		customer: {
			first_name: "John",
			last_name:	"Doe"
		}
	}
}
```

### $__with context example
Example of second-level context provided for `$__with` child definitions.

```javascript
{
	data: {
		first_name: "John",
		last_name:	"Doe"
	},
	parent: <reference to previous (first-level) context>
}
```

### $__repeat context example
Example of second-level context provided for `$__repeat` child definitions.

```javascript
{
	data: {
		first_name: "John",
		last_name:	"Doe"
	},
	key: 6,
	parent: <reference to previous (first-level) context>
}
```

## Scope

To change scope lower for nicer code you can use `$__with` function.

### $__with(key, binding={})

Processes definition rules defined by `binding` where context data is set to specified value.

```javascript
var tpl = Meta.Tempate(target, {
    ".customer": $__with("customer", {
        ".first-name": "first_name",
        ".last-name": "last_name",
    }),
});

tpl({
	customer: {
		first_name: "John",
		last_name:	"Doe"
	}
})
```