---
layout: subpage
parent: components
class: components
permalink: /components/utilities/
order: 12

title: "Utilities"
heading: "Utilities"
description: "Pack of usefull utilities used by other components."
icon: cog
---

## Utility functions

### Module import
MetaJS provides dynamic module imports.

#### window.Meta.config.importUrl

Variable which specifies import url pattern. String `%module%` is replaced by module name.

Default value: `modules/%module%.html`

#### Meta.Utils.import(moduleName, onReady onError)

Imports specified module.

If `onReady` callback is provided then it is called when module has been sucessfully imported.

If `onError` callback is provided then it is called when module import failed.

Callback `onError` accepts error as first argument.

#### Meta.Utils.importMany(moduleList, onReady, onError)

Same as `Meta.Utils.import` but accepts `moduleList` argument as array of modules to import.

### Other usefull functions

#### Meta.Utils.batch(list, processingFn, callback)

Function calls `processingFn` for each item in `list` array.

Argument `processingFn` must be a function which accepts `list` element as first argument and `next` function as second argument. It must call `next` function to continue batch processing.

Function `next` accepts error as first argument. When error is passed then batch is stopped and callback is called with error as first argument.

Otherwise callback is called when all items has been processed without error.

#### Meta.Utils.idHashmap(targetElement)

Function goes throught targetElement child nodes and associates them to result object by it's ID attribute if ID set.

#### Meta.Utils.sanitizeHtml(input)

Function returns input where html open and close tags are converted to HTML entities.

#### Meta.Utils.traverse(o, path)

Function traverses object `o` by `path` array.

```javascript
var o = { x: { y: 1 } };
var r = Meta.Utils.traverse(o, ["x", "y"])

console.log(r);
//Logs: 1
```

#### Meta.Utils.formatDate(format, timestamp)

Port of PHP's date function.