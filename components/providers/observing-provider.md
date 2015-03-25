---
layout: subpage
parent: providers
id: providers-observing
permalink: /components/providers/observing-provider/
order: 2

title: "ObservingProvider"
---

## ObservingProvider

Observing provider uses `Object.observe` to watch for deep model changes and notifies listeners when change occours.

### Usage example
```javascript
var provider = new Meta.ObservingProvider({
	myValue: 0,
	items: []
});

var handler = provider.on("changed", function(data){
	console.log("Data has changed");
});

provider.myValue = 1
//Logs: Data has changed

var item = { x: 0 };

provider.items.push(item);
//Logs: Data has changed

item.x = item.x + 1;
//Logs: Data has changed

provider.items.pull();
//Logs: Data has changed

provider.off("changed", handler);

provider.myValue = 2;
//Logs nothing
```

## ObservingProvider reference

### ObservingProvider(data)

Provider constructor.

If `data` parameter is set then data are merged to provider model.

### ObservingProvider.on(eventName, handler)

Binds event handler.

### ObservingProvider.off(eventName, handler)

Unbinds event handler.

### Event: changed

Provider fires `changed` event when model has changed.