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
