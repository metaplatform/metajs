---
layout: subpage
parent: template
id: template-data-binding
permalink: /components/template/data-binding/
order: 2

title: "Data binding"
---

## Databinding

Data-binding processing functions reference.

### $__html(key)

Sets element innerHTML to raw context value.

```javascript
var tpl = Meta.Template(target, {
    "p.first_name": $__html("first_name"),
});
```

### $__text(key)

Sets element innerHTML to sanitized context value.

```javascript
var tpl = Meta.Template(target, {
    "p.first_name": $__text("first_name"),
});
```

By default if string is provided instead of processing function then `$__text` is used.

### $__string(stringPattern)

Sets element innerHTML to string defined by `stringPattern`.

Pattern is string where #{key} is replaced by context value.

```javascript
var tpl = Meta.Template(target, {
    "p.full_name": $__html("#{first_name} #{last_name}"),
});
```

### $__fn(fn)

Sets element innerHTML to value returned by user-function.

User-function accepts data as first parameter, context as second and `this` is set to current element.

```javascript
var tpl = Meta.Template(target, {
    "p.date": $__fn(function(data, context){
        return data.date.toString()
    }),
});
```

### $__filter(filterName, key)

Sets element innerHTML to context value filtered by global filter - see [filters reference]({{ site.baseurl }}/components/template/filters/).

```javascript
var tpl = Meta.Template(target, {
    "p.last_name": $__filter("uppercase", "last_name"),
});
```

### $__date(format, key)

Sets element innerHTML to date-formated context value.

Context value must be a timestamp or `Date` object.

Parameter `format` is same as in PHP - see [PHP's date function reference](http://php.net/manual/en/function.date.php).

```javascript
var tpl = Meta.Template(target, {
    "p.published": $__date("d. m. Y H:i", "published"),
});
```

### $__attr(attributeName, key)

Sets element attribute specified by `attributeName` to context value.

```javascript
var tpl = Meta.Template(target, {
    "#menu": $__attr("opened", "ui.menu.opened"),
});
```

### $__attrIf(attributeName, key, empty)

Sets element attribute specified by `attribtueName` to context value **only if value is positive**.

If `empty` is set to true, attribute will be added without content, eg.: `<li completed>...</li>`.

```javascript
var tpl = Meta.Template(target, {
    "#menu": $__attrIf("opened", "ui.menu.opened", true),
});
```

### $__classIf(className, key)

Adds or removes element's css class specified by `className` if context key is positive or negative.

```javascript
var tpl = Meta.Template(target, {
    "#menu": $__classIf("opened", "ui.menu.opened"),
});
```

### $__prop(propertyName, key)

Sets element **node object** property to context value.

```javascript
var tpl = Meta.Template(target, {
    "meta-fragment#todo-list": $__prop("model", "todos"),
});
```