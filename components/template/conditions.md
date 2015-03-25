---
layout: subpage
parent: template
id: template-conditions
permalink: /components/template/conditions/
order: 4

title: "Conditions"
---

## Conditions

Condition processing functions reference.

#### Behaviour

If condition is satisfied then DOM node is added back to it's parent node if were removed.

If condition is not satisfied then DOM node is stored as is and removed from it's parent.

Parameter `binding` specifies definition rules which will be processed on child node if condition is satisfied.

Parameter `key` can also be a function returning a value which will be evaluated instead of context value. See [Key, context & scope]({{ site.baseurl }}/components/template/key-context-scope/).

Parameter `value` can also be a function returning a value which will be used for comparision.

#### $__if(key, binding = {})

Conditions is satisfied if context value is **positive**, eg.: true / >0 / non empty.

```javascript
var tpl = Meta.Template(target, {
    ".supplier": $__if("supplier", {
        ".name": "name"
    }),
});
```

#### $__ifNot(key, binding = {})

Conditions is satisfied if context value is **negative**, eg.: false / undefined / null / NaN.

```javascript
var tpl = Meta.Template(target, {
    "#actions": $__ifNot("disabled")
});
```

#### $__ifLt(key, value, binding = {})

Condition is satisfied if context value is **lower** then reference `value`.

```javascript
var tpl = Meta.Template(target, {
    ".success": $__ifLt("errors.length", 1)
});
```

#### $__ifLte(key, value, binding = {})

Condition is satisfied if context value is **lower then or equal** to reference `value`.

```javascript
var tpl = Meta.Template(target, {
    ".success": $__ifLte("errors.length", 1)
});
```

#### $__ifGt(key, value, binding = {})

Condition is satisfied if context value is **greater** then reference `value`.

```javascript
var tpl = Meta.Template(target, {
    ".issues": $__ifGt("issues.length", 0)
});
```

#### $__ifGte(key, value, binding = {})

Condition is satisfied if context value is **greater then or equal** to reference `value`.

```javascript
var tpl = Meta.Template(target, {
    ".issues": $__ifGt("issues.length", 1)
});
```