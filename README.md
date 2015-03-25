# MetaPlatform's metaJS UI Framework
MetaJS is pack of libraries which provides UI building blocks using web-components and HTML5 features.

See [official project site](http://code.meta-platform.com/metajs/) for detailed info, tutorials and components reference.

## Warning
MetaJS is using experimental HTML5 Web Component features which are not part of living standard and is not fully suported by web browsers.

**MetaJS currently natively works only in Google Chrome.**

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

### Content providers
Various reactive model implementations.

### Channel
Implementation of publish / subscribe pattern.

### Utilities
Usefull utility functions which are used by other MetaJS components.

# Working demos
See **demo** directory for working examples and advanced usage.

Demos are also available on: [MetaJS on MetaPlatform's repository](http://repo.meta-platform.com/metajs/demo/)

# Examples
See **examples** directory for working applications.

# Build
```
npm install
gulp [all|all-dev|template|view|fragment|activity|utils|providers|channel|clean]
```

Minified versions of individual components are also available in **dist** directory.

# TO-DO
- Meta-services API client
- Content providers (for MetaAPI types)
- Activity / Fragment modal dialogs

# License
MetaJS is licensed under MIT license - see [LICENSE.md](./LICENSE.md)

Copyright (c) Jiri Hybek, jiri.hybek@cryonix.cz
