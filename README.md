# MetaPlatform's MetaJS UI Framework
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

## MetaJS components

**View**  
View is HTML template using [Handlebars](http://handlebarsjs.com/) as templating engine and supports data-binding and auto-render using model observer.

**Fragment**  
Fragment is basic reusable UI block which is using Views and adds a view logic.  
Example usage: header, toolbar, search box, list view, etc...

**Activity**  
Activity extends fragment and provides top UI element for specific user-experience.  
Example usage: customer list, customer detail, user account, etc...

**Utilities**  
Usefull utility functions which are used by other MetaJS components.

**See demos for working example and advanced usage.**

Demos are also available on: [MetaJS on MetaPlatform's repository](http://repo.meta-platform.com/metajs/demo/)

## TO-DO
- Meta-services API client
- Messaging system (subsribe / publish pattern)
- Content providers

## License
MetaJS is licensed under MIT license - see [LICENSE.md](./LICENSE.md)

Copyright (c) Jiri Hybek, jiri.hybek@cryonix.cz
