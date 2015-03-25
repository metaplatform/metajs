---
layout: subpage
parent: fragment
id: fragment-instance
permalink: /components/fragment-activity/instance/
order: 4

title: "Fragment instance"
---

## Fragment element instance reference

To create fragment instance add `meta-fragment` element to document.

```html
<meta-fragment name="com.example.myFragment"></meta-fragment>
```

### Attributes

#### auto

If auto attribute is set then fragment's method `resume` will be automatically called when fragment is created.

### Properties

#### fragmentElement.config

Property `config` points to fragment definition object.

#### fragmentElement.model

Object containing fragment's model which is passed to view instance.

#### fragmentElement.view

Property `view` points to fragment view instance.

#### fragment.$

Property `$` is bound to fragment view ID's hashmap (`viewInstance.$`).

### Methods

#### fragmentElement.resume(callback)

Resumes fragment - see [Fragment lifecycle]({{ site.baseurl }}/components/fragment-activity/lifecycle/) for more details.

If `callback` attribute is provided then it will be called when fragment was sucessfuly resumed.

Using `callback` is recommended because fragment initialization can be asynchonous and thus delayd due to import of modules.

#### fragmentElement.pause()

Pauses fragment - see [Fragment lifecycle]({{ site.baseurl }}/components/fragment-activity/lifecycle/) for more details.

#### fragmentElement.render()

Renders fragment view.

#### fragmentElement.setView(name)

Sets fragment view manually.

#### fragmentElement.fireEvent(eventName, data)

Dispatches HTMLElement event specified by `eventName` and merges `data` object to Event object.

Fragment events can be bound using standard `addEventListener` method.