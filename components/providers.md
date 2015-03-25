---
layout: subpage
id: providers
parent: components
class: components
permalink: /components/providers/
order: 10

title: "Content providers"
heading: "Content providers"
description: "Content providers creates interface for data modeling and data access."
icon: communication
top: true
---

## Content providers

Content providers represents model layer of our application.

Their roles is to store and manage data. Data can be stored localy of access via some API.

## Builtin content providers

### [ObservingProvider]({{ site.baseurl }}/components/providers/observing-provider/)
Observing provider uses `Object.observe` feature to watch for deep model changes and notifies listeners when change occours.

See [ObservingProvider reference]({{ site.baseurl }}/components/providers/observing-provider/)