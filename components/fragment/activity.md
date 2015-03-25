---
layout: subpage
parent: fragment
id: fragment-activity
permalink: /components/fragment-activity/activity/
order: 8

title: "Activity component"
---

## Activity component

Activity extends fragment component. It has same behaviour but is defined in different registry.

### Activity definition example
```javascript
Meta.Activity("com.example.hello", {

    onResume: function(self){

    	alert("Hello, Iam activity!");

    }

});
```

### Activity usage example
```html
<meta-activity name="com.example.hello" auto></meta-activity>
```

### Creating activity using JavaScript
Activity component also provides shorthand for creating activity instance programmaticaly.

```javascript
Meta.CreateActivity(parentElement, "com.example.hello");
```