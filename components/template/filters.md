---
layout: subpage
parent: template
id: template-filters
permalink: /components/template/filters/
order: 8

title: "Filters"
---

## Filters

Custom filters reference.

### Meta.Template.registerFilter("name", function);

Register custom filter globaly so every template instance can use it.

User-function accepts `value` as first parameter and `params` object as second.

```javascript
Meta.Template.registerFilter("uppercase", function(value, params){
    return value.substr(params.start, params.length);
});
```

## Default filters

### uppercase
Converts string to upperacse.

### lowercase
Converts string to lowercase.

### trim
Trims string.

### substr
Return substring of given string.

**Parameters:**

```javascript
{
	offset: integer,
	length: integer
}
```

### replace
Replaces substring of given string.

**Parameters:**

```javascript
{
	find:    string|regexp,
	replace: string,
	global:  boolean (true)
}
```