---
layout: subpage
parent: fragment
id: fragment-lifecycle
permalink: /components/fragment-activity/lifecycle/
order: 6

title: "Fragment lifecycle"
---

## Fragment lifecycle

Fragment's life is divded into `created`, `ready`, `resumed` and `paused` states.

### Created state
Fragment state is set to `created` when:

- All modules are imported
- Fragment model has been initialized
- onCreate handler has been called

**In this state `view` property is not available yet.**

Fragment element **visibility** css property is set to **hidden**.

### Ready state
Fragment state is set to `ready` when:

- View has been materialized (but not rendered yet)
- All child fragments has been created (but not ready and not resumed yet)

In this state child fragment properties should be set - provider binding for example.

### Resumed state
Fragment state is set to `resumed` when `fragmentElement.resume` method has been called.

**Resume cycle:**

1. If fragment is resumed at first time then fragment's css property **visibility** is set to **visible**.
2. Resume all child fragments and wait until they all are resumed
3. Call `onResume` handler - now `view` property is available
4. Call `fragmentElement.resume` method's `callback`

In this cycle and in `onResume` handler we should initialize content providers, bind to their notifications and do other manual binding if neccesary.

If `auto` attribute has been set to `meta-fragment` element then fragment will be automatialy resumed right after it's initialization.

### Paused state
Fragment state is set to `paused` when `fragmentElement.pause` method has been called or when **fragment node has been dettached from DOM**.

**Pause cycle:**

1. Unbind all fragment's view template events
2. Pause all child fragments
3. Call `onPause` handler

In this cycle and in `onPause` handler we should unbind all events which has been bound to content providers and other stuff. It is because when fragment is not active anymore (maybe beacause of dettaching from DOM) we don't wont to react on changes and update view anymore.