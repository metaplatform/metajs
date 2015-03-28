---
layout: subpage
parent: components
class: components
permalink: /components/channel/
order: 8

title: "Channel"
heading: "Channel"
description: "Implementation of publish / subscribe pattern."
icon: split
---

## Channel component

Channels are simple implementation of publish / subscribe pattern.

### Local channel example
```javascript
var localChannel = new Meta.Channel();

var subscriber = localChannel.subscribe(function(message){
	console.log("Received message", message);
});

localChannel.publish({
	"Hello world!"
});

localChannel.unsubscribe(subscriber);

```

### Global channel example
```javascript
new Meta.Channel({ name: "global-channel" });

//In one part of application
var subscriber = Meta.channels["global-channel"].subscribe(function(message){
	console.log("Received message", message);
});

//In another part of application
Meta.channels["global-channel"].publish({
	"Hello world!"
});

```

## Channel object reference

### Meta.Channel(config)

Channel constructor.

#### config.name: string

If config property **name** is set then channel is added to `Meta.channels` object by specified `name`.

#### config.onPublish: function(message)  

If **onPublish** property is set then every published message is passed to this function. Function should throw an error if has invalid format. Function must return message instance so it can modify it. This function is usefull when using global channels and message validation is needed.

### Channel.subscribe(handler)

Adds handler which will be called when someone publishes message to the channel.

### Channel.unsubscribe(handler)

Removes handler from subscriptions.

### Channel.publish(message)

Publishes message to channel so all subscribers will be notified and will receive published message.