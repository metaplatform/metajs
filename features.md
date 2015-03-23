---
layout: page
class: homepage
permalink: /features/
order: 2

title: "Features"
heading: "Features"
description: "Overview of MetaJS features."
icon: features
---

## DOM templating engine

MetaJS provides templating engine which manipulates directly with DOM.

This way needs no re-rendering so it is efficient and provides high performance.

**DOM based**  
No re-rendering and no browser re-parsing provides high performance.

**Data binding**  
Templating engine provides data binding, conditions and loops.

- when item is added to array then new dom node is appended
- when item is removed from array then dom node is removed
- when position of item has changed then dom node is only moved
- when item data has changed then binding is updated = no flickering and ui glitches

**Rule based**  
Template logic is defined by rules (processing functions) and provides flexible interface for non-standard usage.

## Views

MetaJS provides **View** component which is wrapper for templates and adds view-logic and other features.

**View logic**  
Views wraps template logic.

**Event binding**  
Views provides automatic event binding when template data changed. So you define event bindings once and when nodes are added or changed their events are automatically binded.

**Global registry**  
Views are defined only once and can be added to registry so other components can access it via name reference.

## Fragments

MetaJS provides **Fragment** component which represent re-usable UI block.

Example usage: header, toolbar, search-box, list view, etc...

**Component logic**  
Fragments uses Views and wraps its view-logic and event binding.

**Data model**  
Fragments provides data model object which is binded to view.

**Custom methods & Events**  
Fragments provides interface for defining custom component methods and firing Element events which can be binded via standard addEventListener method.

## Activities

MetaJS provides **Activity** component which extends Fragment and represents specific application screen or activity.

Example usage: customer list, customer detail, user account, etc...

**Module imports**  
MetaJS provides utility for dynamic import of HTML modules and Activity can specify modules which should be loaded before it is initialized.

## Code examples

See [Tutorial](/metajs/tutorial/) or [Components reference](/metajs/components/) for code samples and example usage.

