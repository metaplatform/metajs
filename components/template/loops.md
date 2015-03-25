---
layout: subpage
parent: template
id: template-loops
permalink: /components/template/loops/
order: 6

title: "Loops"
---

## Loops
Loops processing functions reference.

### $__repeat(key, binding = {})

Repeats nodes specified by selector for each item in context value.

Parameter `binding` defines definition rules which will be processed for every repeated element.

Context value can be both object or an array.

Each repeated node is bound to it's context data so when element position changes then node is just moved in DOM and thus not re-created.

Iteration key is available for child definition rules as `key` context meta-value so it is accessible by key `@key`.

```javascript
var tpl = Meta.Tempate(target, {
    ".customers li": $__repeat("customers", {
    	"@":			$__attr("index", "@key"),
        ".first_name":	"first_name",
        ".last_name":	"last_name",
    }),
});
```