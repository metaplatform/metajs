/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

window.Meta.Utils = {};

//Initialize config
if(!window.Meta.config)
	window.Meta.config = {};

if(!window.Meta.config.importUrl)
	window.Meta.config.importUrl = "modules/%module%.html";

//Initialize imported modules list
window.Meta.Utils._importedModules = [];

/*
 * Module import
 */
window.Meta.Utils.import = function(name, onReady, onError){

	if( window.Meta.Utils._importedModules.indexOf(name) >= 0 )
		return onReady();

	var link = document.createElement('link');
	
	link.rel = 'import';
	link.href = window.Meta.config.importUrl.replace(/\%module\%/g, name);

	link.onload = function() {

		window.Meta.Utils._importedModules.push(name);

		if(onReady) onReady();

	};

	link.onerror = function(e) {
		console.log("Error importing meta module '" + name + "'", e);

		if(onError) onError(e);
	};
	
	document.head.appendChild(link);

}

window.Meta.Utils.importMany = function(moduleList, onReady, onError){

	var importModule = function(name, next){

		window.Meta.Utils.import(name, function(){
			
			return next();

		}, function(err){
			
			return next("Cannot import module '" + name + "'");

		});

	}

	window.Meta.Utils.batch(moduleList, importModule, function(err){

		if(err)
			return onError(err);
		else
			return onReady();

	});

}

/*
 * Batch function call
 */
window.Meta.Utils.batch = function(list, fn, onDone){

	var cursor = -1;

	var next = function(err){

		cursor++;

		if(err)
			return onDone(err);

		if(cursor == list.length)
			return onDone();

		fn(list[cursor], next);

	}

	next();

}

/*
 * ID hash map
 */
window.Meta.Utils.idHashmap = function(src){

	var hashmap = {};

	var els = src.querySelectorAll("*[id]");

	for(var i = 0; i < els.length; i++)
		hashmap[ els.item(i).getAttribute('id') ] = els.item(i);

	return hashmap;

}

/*
 * Sanitize HTML
 */
window.Meta.Utils.sanitizeHtml = function(input){

	var tagOpen = new RegExp("<", "g");
	var tagClose = new RegExp("<", "g");

	return String(input).replace(tagOpen, '&lt;').replace(tagClose, '&gt;');

}

/*
 * Traverse object structure
 */
window.Meta.Utils.traverse = function(o, path){

	var key = path.shift();

	if(!o[key]) return undefined;

	if(path.length > 0)
		return window.Meta.Utils.traverse(o[key], path);
	else
		return o[key];

}

/*
 * Format date
 * Got from: http://phpjs.org/functions/date/
 */
window.Meta.Utils.formatDate = function (n,t){var e,r,u=this,o=["Sun","Mon","Tues","Wednes","Thurs","Fri","Satur","January","February","March","April","May","June","July","August","September","October","November","December"],i=/\\?(.?)/gi,c=function(n,t){return r[n]?r[n]():t},a=function(n,t){for(n=String(n);n.length<t;)n="0"+n;return n};return r={d:function(){return a(r.j(),2)},D:function(){return r.l().slice(0,3)},j:function(){return e.getDate()},l:function(){return o[r.w()]+"day"},N:function(){return r.w()||7},S:function(){var n=r.j(),t=n%10;return 3>=t&&1==parseInt(n%100/10,10)&&(t=0),["st","nd","rd"][t-1]||"th"},w:function(){return e.getDay()},z:function(){var n=new Date(r.Y(),r.n()-1,r.j()),t=new Date(r.Y(),0,1);return Math.round((n-t)/864e5)},W:function(){var n=new Date(r.Y(),r.n()-1,r.j()-r.N()+3),t=new Date(n.getFullYear(),0,4);return a(1+Math.round((n-t)/864e5/7),2)},F:function(){return o[6+r.n()]},m:function(){return a(r.n(),2)},M:function(){return r.F().slice(0,3)},n:function(){return e.getMonth()+1},t:function(){return new Date(r.Y(),r.n(),0).getDate()},L:function(){var n=r.Y();return n%4===0&n%100!==0|n%400===0},o:function(){var n=r.n(),t=r.W(),e=r.Y();return e+(12===n&&9>t?1:1===n&&t>9?-1:0)},Y:function(){return e.getFullYear()},y:function(){return r.Y().toString().slice(-2)},a:function(){return e.getHours()>11?"pm":"am"},A:function(){return r.a().toUpperCase()},B:function(){var n=3600*e.getUTCHours(),t=60*e.getUTCMinutes(),r=e.getUTCSeconds();return a(Math.floor((n+t+r+3600)/86.4)%1e3,3)},g:function(){return r.G()%12||12},G:function(){return e.getHours()},h:function(){return a(r.g(),2)},H:function(){return a(r.G(),2)},i:function(){return a(e.getMinutes(),2)},s:function(){return a(e.getSeconds(),2)},u:function(){return a(1e3*e.getMilliseconds(),6)},e:function(){throw"Not supported (see source code of date() for timezone on how to add support)"},I:function(){var n=new Date(r.Y(),0),t=Date.UTC(r.Y(),0),e=new Date(r.Y(),6),u=Date.UTC(r.Y(),6);return n-t!==e-u?1:0},O:function(){var n=e.getTimezoneOffset(),t=Math.abs(n);return(n>0?"-":"+")+a(100*Math.floor(t/60)+t%60,4)},P:function(){var n=r.O();return n.substr(0,3)+":"+n.substr(3,2)},T:function(){return"UTC"},Z:function(){return 60*-e.getTimezoneOffset()},c:function(){return"Y-m-d\\TH:i:sP".replace(i,c)},r:function(){return"D, d M Y H:i:s O".replace(i,c)},U:function(){return e/1e3|0}},this.date=function(n,t){return u=this,e=void 0===t?new Date:new Date(t instanceof Date?t:1e3*t),n.replace(i,c)},this.date(n,t)};
/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

/*
 * Template builder
 */
window.Meta.Template = function(target, definition){

	var processor = window.Meta.Template.processor(definition);

	return function(data){
		processor.call(target, { data: data});
	}

}

window.Meta.Template._context = function(parent, attrs){

	var context = {};

	for(var k in attrs)
		context[k] = attrs[k];

	context.data = parent.data;

	return context;

}

window.Meta.Template._value = function(el, context, key){

	if(key instanceof Function)
		return key.call(el, context.data, context);

	if(key.substr(0, 1) == "@"){
		var src = context;
		key = key.substr(1);
	} else {
		var src = context.data;
	}

	if(key.indexOf(".") >= 0)
		return window.Meta.Utils.traverse(src, key.split("."));
	else
		return src[key];

}

window.Meta.Template.processor = function(definition){

	//Set defaults
	for(selector in definition || {}){

		if(definition[selector] instanceof Array){
			
			for(var i = 0; i < definition[selector].length; i++)
				if(!(definition[selector][i] instanceof Function))
					definition[selector][i] = window.Meta.Template.text(definition[selector][i]);

		} else {

			if(!(definition[selector] instanceof Function))
				definition[selector] = window.Meta.Template.text(definition[selector]);

		}

	}

	//Define runner
	var runner = function(el, context, processor){

		if(processor instanceof Array)
			for(var i = 0; i < processor.length; i++)
				processor[i].call(el, context);

		else
			processor.call(el, context);

	}

	//Return processing function
	return function(context){

		for(selector in definition || {}){

			if(definition[selector] instanceof Function && definition[selector].runInParentContext){
				definition[selector].call(this, window.Meta.Template._context(context, {
					"selector": selector
				}));

				continue;
			}

			//Check self
			if(selector == "@"){
				runner(this, context, definition[selector]);
				continue;
			}

			var els = this.querySelectorAll(selector);

			//Call processors for each element
			for(var i = 0; i < els.length; i++)
				runner(els.item(i), context, definition[selector]);

		}

	}

}

/*
 * Filter registry
 */
window.Meta.Template.filters = {};

window.Meta.Template.registerFilter = function(name, fn){

	window.Meta.Template.filters[name] = fn;

}

/*
 * Template processors
 */
window.Meta.Template.html = function(key){

	return function(context){
		this.innerHTML = window.Meta.Template._value(this, context, key) || "";
	}

}

window.Meta.Template.text = function(key){

	return function(context){
		this.innerHTML = window.Meta.Utils.sanitizeHtml( window.Meta.Template._value(this, context, key) );
	}

}

window.Meta.Template.string = function(pattern){

	var matches = pattern.match(/#\{([a-zA-Z0-9_-]*)\}/g);
	var vars = {};

	for(var m = 0; m < matches.length; m++){
		var name = matches[m].substr(2, matches[m].length - 3);
		vars[name] = new RegExp("#\\{" + name + "\\}", "g");
	}

	return function(context){

		var value = pattern;

		for(var v in vars){
			value = value.replace(vars[v], window.Meta.Template._value(this, context, v));
		}

		this.innerHTML = value;
	}

}

window.Meta.Template.fn = function(callback){

	return function(context){
		this.innerHTML = callback.call(this, context.data, context);
	}

}

window.Meta.Template.filter = function(name, key, params){

	return function(context){

		if(!window.Meta.Template.filters[name])
			throw "Template filter '" + name + "' not registered.";

		this.innerHTML = window.Meta.Template.filters[name].call(this, window.Meta.Template._value(this, context, key), params, context);

	}

}

window.Meta.Template.date = function(key, format){

	return function(context){

		var date = window.Meta.Template._value(this, context, key);

		if(parseInt(date) === NaN || !(date instanceof Date) )
			return this.innerHTML = "NaN";

		this.innerHTML = window.Meta.Utils.formatDate(format, date);

	}

}

window.Meta.Template.with = function(key, definition){

	var processor = window.Meta.Template.processor(definition);

	return function(context){

		if(!context.data[key]) return;

		processor.call(this, window.Meta.Template._context({
			data: context.data[key]
		}, {
			parent: context.data
		}));

	}

}

window.Meta.Template.attr = function(name, key){

	return function(context){

		if(typeof ShadowRoot !== 'undefined' && this instanceof ShadowRoot)
			var el = this.host;
		else
			var el = this;
		
		el.setAttribute(name, window.Meta.Template._value(this, context, key));

	}

}

window.Meta.Template.attrIf = function(name, key, empty){

	return function(context){
		
		var value = window.Meta.Template._value(this, context, key);

		if(typeof ShadowRoot !== 'undefined' && this instanceof ShadowRoot)
			var el = this.host;
		else
			var el = this;

		if(value)
			el.setAttribute(name, ( empty ? '' : value ) );
		else if(el.hasAttribute(name))
			el.removeAttribute(name);

	}

}

window.Meta.Template.classIf = function(name, key){

	return function(context){
		
		var value = window.Meta.Template._value(this, context, key);

		if(typeof ShadowRoot !== 'undefined' && this instanceof ShadowRoot)
			var el = this.host;
		else
			var el = this;

		if(value)
			el.classList.add(name);
		else if(el.classList.contains(name))
			el.classList.remove(name);

	}

}

window.Meta.Template.property = function(name, key){

	return function(context){

		if(typeof ShadowRoot !== 'undefined' && this instanceof ShadowRoot)
			var el = this.host;
		else
			var el = this;

		el[name] = (key ? window.Meta.Template._value(this, context, key) : context.data);

	}

}

window.Meta.Template._if = function(definition, exp){

	var processor = window.Meta.Template.processor(definition);

	var f = function(context){
		
		var result = exp.call(this, context);

		if(result){

			//Restore state
			if(this.__ifRegistry && this.__ifRegistry[context["selector"]]){
				var registry = this.__ifRegistry[context["selector"]];

				for(var i = 0; i < registry.length; i++)
					if(registry[i].__nextSibling && registry[i].__nextSibling.parentElement == registry[i].__parent)
						registry[i].__parent.insertBefore(registry[i], registry[i].__nextSibling);
					else
						registry[i].__parent.appendChild(registry[i]);

				delete this.__ifRegistry[context["selector"]];

			}

			//Process children
			var els = this.querySelectorAll(context["selector"]);

			for(var i = 0; i < els.length; i++)
				processor.call(els.item(i), context);

		} else {

			var els = this.querySelectorAll(context["selector"]);
			
			if(!this.__ifRegistry)
				this.__ifRegistry = {};

			if(!this.__ifRegistry[context["selector"]])
				this.__ifRegistry[context["selector"]] = [];

			for(var i = 0; i < els.length; i++){

				els.item(i).__parent = els.item(i).parentElement;
				els.item(i).__nextSibling = els.item(i).nextSibling;

				this.__ifRegistry[context["selector"]].push(els.item(i));
				
				els.item(i).parentElement.removeChild(els.item(i));

			}

		}

	}

	f.runInParentContext = true;

	return f;

}

window.Meta.Template.if = function(key, definition){

	return window.Meta.Template._if(definition, function(context){
		return ( window.Meta.Template._value(this, context, key) ? true : false );
	})

}

window.Meta.Template.ifNot = function(key, definition){

	return window.Meta.Template._if(definition, function(context){
		return ( !window.Meta.Template._value(this, context, key) ? true : false );
	})

}

window.Meta.Template.ifLt = function(key, value, definition){

	return window.Meta.Template._if(definition, function(context){
		var v = (value instanceof Function ? value.call(this, context.data, context) : value );
		return ( window.Meta.Template._value(this, context, key) < v ? true : false );
	})

}

window.Meta.Template.ifLte = function(key, value, definition){

	return window.Meta.Template._if(definition, function(context){
		var v = (value instanceof Function ? value.call(this, context.data, context) : value );
		return ( window.Meta.Template._value(this, context, key) <= v ? true : false );
	})

}

window.Meta.Template.ifGt = function(key, value, definition){

	return window.Meta.Template._if(definition, function(context){
		var v = (value instanceof Function ? value.call(this, context.data, context) : value );
		return ( window.Meta.Template._value(this, context, key) > v ? true : false );
	})

}

window.Meta.Template.ifGte = function(key, value, definition){

	return window.Meta.Template._if(definition, function(context){
		var v = (value instanceof Function ? value.call(this, context.data, context) : value );
		return ( window.Meta.Template._value(this, context, key) >= v ? true : false );
	})

}

window.Meta.Template.repeat = function(key, definition){

	var processor = window.Meta.Template.processor(definition);

	var keyMap = function(data){

		var map = [];

		if(data instanceof Array){
			
			for(var i = 0; i < data.length; i++)
				map[i] = data[i];

		} else if(data instanceof Object) {

			var x = 0;

			for(var i in data || {}){
				map[x] = i;
				x++;
			}

		} else {
			
			return null;

		}
				
		return map;

	}

	var f = function(context){

		//Create template
		if(!this.__repeatTemplate)
			this.__repeatTemplate = {};

		if(!this.__repeatTemplate[context["selector"]]){
			
			this.__repeatTemplate[context["selector"]] = [];

			var els = this.querySelectorAll(context["selector"]);

			for(var i = 0; i < els.length; i++){
				els.item(i).__parent = els.item(i).parentElement;
				
				this.__repeatTemplate[context["selector"]].push(els.item(i));
				
				els.item(i).parentElement.removeChild(els.item(i));
			}

		}
		
		//Define lists
		var scope = this;
		var removeStack = [];
		var remainStack = {};
		var lastElement = null;

		//Get items to repeat
		var items = window.Meta.Template._value(this, context, key);
		var map = keyMap(items);

		if(!map) return;

		//Revise current items
		var els = this.querySelectorAll(context["selector"]);

		for(var i = 0; i < els.length; i++){

			var mapIndex = map.indexOf(els.item(i).__id);

			if(mapIndex >= 0){

				if(!remainStack[mapIndex])
					remainStack[mapIndex] = [];

				remainStack[mapIndex].push(els.item(i));

			} else {
				removeStack.push(els.item(i));
			}

		}

		//Remove old elements
		for(var c = 0; c < removeStack.length; c++)
			removeStack[c].parentElement.removeChild(removeStack[c]);

		delete removeStack;

		//Bind new nodes and reorder old ones
		for(var i = 0; i < map.length; i++){

			if(map[i] instanceof Object)
				var data = map[i];
			else
				var data = items[map[i]];

			if(remainStack[i]){

				for(var r = 0; r < remainStack[i].length; r++){

					if(remainStack[i][r] instanceof HTMLElement)
						processor.call(remainStack[i][r], window.Meta.Template._context({
							data: data
						}, {
							parent: context.data,
							index: i,
							key: map[i]
						}));

					if(remainStack[i][r].previousElementSibling != lastElement)
						remainStack[i][r].parentElement.appendChild(remainStack[i][r]);

					lastElement = remainStack[i][r];

				}

			} else {

				for(var t = 0; t < scope.__repeatTemplate[context["selector"]].length; t++){

					var el = scope.__repeatTemplate[context["selector"]][t].cloneNode(true);
					
					el.__id = map[i];
					scope.__repeatTemplate[context["selector"]][t].__parent.appendChild(el);

					processor.call(el, window.Meta.Template._context({
						data: data
					}, {
						parent: context.data,
						index: i,
						key: map[i]
					}));

					lastElement = el;

				}

			}

		};

	}

	f.runInParentContext = true;

	return f;

}

/*
 * Template processor aliases
 */
//String processors
window.$__html		= window.Meta.Template.html;
window.$__text		= window.Meta.Template.text;
window.$__string	= window.Meta.Template.string;
window.$__fn		= window.Meta.Template.fn;
window.$__filter	= window.Meta.Template.filter;
window.$__date   	= window.Meta.Template.date;

//Attribute processors
window.$__attr		= window.Meta.Template.attr;
window.$__attrIf	= window.Meta.Template.attrIf;
window.$__classIf	= window.Meta.Template.classIf;
window.$__prop		= window.Meta.Template.property;

//Condition processors
window.$__if 		= window.Meta.Template.if;
window.$__ifNot 	= window.Meta.Template.ifNot;
window.$__ifLt	 	= window.Meta.Template.ifLt;
window.$__ifLte	 	= window.Meta.Template.ifLte;
window.$__ifGt	 	= window.Meta.Template.ifGt;
window.$__ifGte	 	= window.Meta.Template.ifGte;

//Loop processors
window.$__repeat	= window.Meta.Template.repeat;

//Scope processors
window.$__with	= window.Meta.Template.with;

/*
 * Default filters
 */
Meta.Template.registerFilter("uppercase", function(value, params){
    return value.toUpperCase();
});

Meta.Template.registerFilter("lowercase", function(value, params){
    return value.toLowerCase();
});

Meta.Template.registerFilter("trim", function(value, params){
    return value.trim();
});

Meta.Template.registerFilter("substr", function(value, params){
    return value.substr(params.offset, params.length);
});

Meta.Template.registerFilter("replace", function(value, params){
    
    if(!params.find || !params.replace) return "NaN";

    if(params.find instanceof RegExp){
    	
    	return value.replace(params.find, params.replace);

    } else if(params.global){

    	var r = new RegExp(params.find, "g");
    	return value.replace(r, params.replace);

    } else {

    	return value.replace(params.find, params.replace);

    }

});
/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

window.Meta.views = {};

/*
 * View prototype
 */
window.Meta.ViewPrototype = Object.create(HTMLTemplateElement.prototype);

window.Meta.ViewPrototype.createdCallback = function(){

	//Register to global view registry
	if(this.hasAttribute("name"))
		window.Meta.views[ this.getAttribute("name") ] = this;

};

window.Meta.ViewPrototype.instance = function(target, binding){

	var view = this;

	var instance = {

		target: null,
		template: null,
		model: {},
		events: {},
		eventsContext: null,

		/*
		 * Redefine template
		 */
		materialize: function(target, binding){

			//Set target
			instance.target = target;

			//Create template instance
			if(!instance.target._templateInstanced){

				//Clear target content
				instance.target.innerHTML = "";

				//Create instance
				instance.target.appendChild( document.importNode(view.content, true) );
				instance.target._templateInstanced = true;

			}

			//Define template
			instance.template = window.Meta.Template(target, binding);

			//Update hashtable
			instance.$ = window.Meta.Utils.idHashmap(instance.target);

		},

		/*
		 * Bind event
		 */
		on: function(name, selector, handler){

			instance.events[name + " " + selector] = handler;

		},

		/*
		 * Bind events to target
		 */
		_bindEvents: function(){

			var bindEvent = function(el, event, handler){

				if(el._boundEvents && el._boundEvents.indexOf(event) >= 0)
					return;

				var innerHandler = function(ev){

					ev.sender = el;
					handler.call(instance.eventsContext || this, ev);

				};

				innerHandler.eventName = event;

				el.addEventListener(event, innerHandler);

				if(!el._boundEvents) el._boundEvents = [];
				if(!el._boundEventHandlers) el._boundEventHandlers = [];

				el._boundEvents.push(event);
				el._boundEventHandlers.push(innerHandler);

			}

			for(var e in instance.events){

				var key = e.split(" ");
				var event = key.shift();
				var selector = key.join(" ");

				if(selector != "")
					var elList = instance.target.querySelectorAll(selector);
				else if(instance.target instanceof ShadowRoot)
					var elList = [ instance.target.host ];
				else
					var elList = [ instance.target ];

				for(var i = 0; i < elList.length; i++)
					bindEvent(elList[i], event, instance.events[e]);

			}

		},

		_unbindEvents: function(){

			for(var e in instance.events){

				var key = e.split(" ");
				var event = key.shift();
				var selector = key.join(" ");

				if(selector != "")
					var elList = instance.target.querySelectorAll(selector);
				else if(instance.target instanceof ShadowRoot)
					var elList = [ instance.target.host ];
				else
					var elList = [ instance.target ];

				for(var i = 0; i < elList.length; i++){

					if(!elList[i]._boundEventHandlers) continue;

					for(var e = 0; e < elList[i]._boundEventHandlers.length; e++)
						elList[i].removeEventListener(elList[i]._boundEventHandlers[e].eventName, elList[i]._boundEventHandlers[e]);
					
					elList[i]._boundEvents = [];
					elList[i]._boundEventHandlers = [];

				}

			}

		},

		/*
		 * Render template to target element
		 */
		render: function(){

			//Validate
			if(!instance.template)
				throw "Template is not materialized."

			//Render
			instance.template(instance.model);

			//Bind events
			instance._bindEvents();

			//Update hashtable
			instance.$ = window.Meta.Utils.idHashmap(instance.target);

		},

		/*
		 * DOM function aliases
		 */
		find: function(selector){ return instance.target.querySelector(selector); },
		findAll: function(selector){ return instance.target.querySelectorAll(selector); },

	}

	instance.eventsContext = instance;

	if(target && binding)
		instance.materialize(target, binding);

	return instance;

}

/*
 * Register element
 */
document.registerElement('meta-view', {
	prototype: window.Meta.ViewPrototype,
	extends: 'template'
});
/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

window.Meta.fragments = {};

/*
 * Fragment registration
 */
window.Meta.Fragment = function(name, config){

	//Assign defaults
	if(config.shadowRoot == undefined)
		config.shadowRoot = true;

	//Extends?
	if(config.extends){

		if( !(config.extends instanceof Array) )
			config.extends = [ config.extends ];

		for(var i = 0; i < config.extends.length; i++){

			if(!window.Meta.fragments[config.extends[i]])
				throw "Cannot register fragment '" + name + "': parent fragment '" + config.extends[i] + "' not found."

			for(var k in window.Meta.fragments[config.extends[i]])
				config[k] = window.Meta.fragments[config.extends[i]][k];

		}

	}

	//Assign config
	window.Meta.fragments[name] = config;

}

/* ---------------------------------------------------------------------------
 * Fragment prototype
 -------------------------------------------------------------------------- */
window.Meta.FragmentPrototype = Object.create(HTMLElement.prototype);

window.Meta.FragmentPrototype._defaultMethods = [ "onCreate", "onReady", "onResume", "onPause", "onRender" ]

/*
 * Get config method - can be overriden
 */
window.Meta.FragmentPrototype._getConfig = function(name){

	return window.Meta.fragments[name] || null;

}

/*
 * Component init - handles setup and import
 */
window.Meta.FragmentPrototype.init = function(){

	//Check state
	if(this.name)
		throw "Fragment '" + name + "' already initialized.";

	//Assign name
	this.name = this.getAttribute("name");
	
	//Assign state variables
	this._created = false;
	this._ready = false;
	this._auto = ( this.hasAttribute("auto") ? true : false );
	this._paused = true;
	this._resumeStack = [];
	this._readyStack = [];

	//Get fragment config
	this.config = this._getConfig(this.name);

	if(!this.config)
		throw "Fragment '" + this.name + "' not registered.";

	//Import methods
	for(k in this.config)
		if(this.config[k] instanceof Function && window.Meta.FragmentPrototype._defaultMethods.indexOf(k) < 0)
			this.bindMethod(this, k, this.config[k])

	//Create shadow root?
	if(this.config.shadowRoot)
		this.fragmentRoot = this.createShadowRoot();
	else
		this.fragmentRoot = this;

	//Hide fragment
	this.style.visibility = 'hidden';
	
	//Handle imports
	var self = this;

	if(this.config.import){

		window.Meta.Utils.importMany(this.config.import, function(){

			self.create();

		}, function(){
			
			throw "Imports for fragment '" + self.name + "' failed";

		})

	} else {

		self.create();

	}

}

/*
 * Component constructor - called when all imports are ready
 */
window.Meta.FragmentPrototype.create = function(){

	//Check state
	if(this._created)
		throw "Fragment '" + this.name + "' already created.";

	//Save context
	var self = this;

	//Define model
	if(this.config.model)
		this.model = Object.create(this.config.model);
	else
		this.model = {};

	//Call create method
	if(this.config.onCreate)
		this.config.onCreate.call(this, this);

	//Set state
	this._created = true;

	//Fire create event
	this.fireEvent("create");

	//Set view
	this.setView(this.config.view);

	//Wait for all child fragments been created
	var checkChild = function(childFragment, next){
		childFragment.whenReady(next);
	};

	var childFragments = this.fragmentRoot.querySelectorAll("meta-fragment, meta-activity");

	window.Meta.Utils.batch(childFragments, checkChild, function(){

		//Set state
		self._ready = true;

		//Call onReady handler
		if(self.config.onReady)
			self.config.onReady.call(self, self);

		//Call ready stack
		for(var i in self._readyStack)
			if(self._readyStack[i]) self._readyStack[i].call(self);

		self._readyStack = [];

		//Resume?
		if( (self.parentElement && self._auto) || self._resumeStack.length > 0 )
			self.resume();

	});

}

/*
 * Component resume
 */
window.Meta.FragmentPrototype.resume = function(cb){

	//Validate state
	if(!this._paused){
		
		this.render();
		if(cb) return cb(); else return;

	}
	
	//Add to stack
	this._resumeStack.push(cb);

	//Check state
	if(!this._ready)
		return;

	//Save context
	var self = this;

	//Async resume handler
	this.render();

	//Resume childs fragments
	var resumeChild = function(childFragment, next){
		childFragment.resume(next);
	};

	var childFragments = this.fragmentRoot.querySelectorAll("meta-fragment, meta-activity");

	window.Meta.Utils.batch(childFragments, resumeChild, function(){

		//Set state
		self._paused = false;

		//Call onResume handler
		if(self.config.onResume)
			self.config.onResume.call(self, self);

		for(var i in self._resumeStack)
			if(self._resumeStack[i]) self._resumeStack[i].call(self);

		self._resumeStack = [];

		//Show fragment
		self.style.visibility = 'visible';

	});

}

/*
 * Component pause
 */
window.Meta.FragmentPrototype.pause = function(cb){

	//Validate state
	if(!this._created || this._paused)
		if(cb) return cb(); else return;

	//Unbind view events
	if(this.view)
		this.view._unbindEvents();

	//Resume childs fragments
	var self = this;

	var pauseChild = function(childFragment, next){
		childFragment.pause(next);
	};

	var childFragments = this.fragmentRoot.querySelectorAll("meta-fragment, meta-activity");

	window.Meta.Utils.batch(childFragments, pauseChild, function(){

		//Set state
		self._paused = true;

		//Call onPause handler
		if(self.config.onPause)
			self.config.onPause.call(self, self);

		if(cb) cb();

	});

}

window.Meta.FragmentPrototype.whenReady = function(cb){

	if(this._ready)
		return cb();
	else
		this._readyStack.push(cb);

}

/*
 * Bind method
 */
window.Meta.FragmentPrototype.bindMethod = function(self, name, fn){

	self[k] = function(){

			if(!self._created || self._paused)
				throw "Fragment '" + this.name + "' is not ready yet.";
				
			fn.apply(self, arguments);

	};

}

/*
 * Set fragment view
 */
window.Meta.FragmentPrototype.setView = function(view){

	if(typeof view == "string"){
		
		if(!window.Meta.views[view])
			throw "Meta view '" + view + "' not registered.";

		this.view = window.Meta.views[view].instance();

	} else {

		this.view = view.instance();

	}

	//Configure template
	this.view.materialize(this.fragmentRoot, this.config.binding || {});

	//Assign view params
	this.view.model = this.model;
	this.view.events = this.config.events || {};
	this.view.eventsContext = this;
	this.view.fragment = this;

	//Bind hashmap
	this.$ = this.view.$;

}

/*
 * Render view shorthand
 */
window.Meta.FragmentPrototype.render = function(){

	//Render view
	if(this.view){
		
		this.view.render();
		this.$ = this.view.$;

	}

	//Call render functon
	if(this.config.onRender)
		this.config.onRender.call(this, this);

}

/*
 * Component constructor
 */
window.Meta.FragmentPrototype.createdCallback = function(){
	
	if(this.hasAttribute("name"))
		this.init();

};

/*
 * DOM attached
 */
window.Meta.FragmentPrototype.attachedCallback = function(){

	if(this._created && this._auto)
		this.resume();

}

/*
 * DOM dettached
 */
window.Meta.FragmentPrototype.dettachedCallback = function(){

	if(this._created && this._auto)
		this.pause();

}

/*
 * DOM attribute changed
 */
window.Meta.FragmentPrototype.attributeChangedCallback = function(attrName, oldVal, newVal){

	if(attrName == "name")
		this.init();
	else
		this.fireEvent(attrName + "Changed", {
			fragment: this
		});

}

/*
 * Event shorthand
 */
window.Meta.FragmentPrototype.fireEvent = function(name, data){

	var ev = new CustomEvent(name);
	
	ev.fragment = this;

	for(var k in data)
		ev[k] = data[k];

	this.dispatchEvent(ev);

}

/*
 * Register element
 */
document.registerElement('meta-fragment', {
	prototype: window.Meta.FragmentPrototype
});
/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

window.Meta.activities = {};

/*
 * Activity registration
 */
window.Meta.Activity = function(name, config){

	//Assign defaults
	if(config.shadowRoot == undefined)
		config.shadowRoot = true;

	//Extends?
	if(config.extends){

		if( !(config.extends instanceof Array) )
			config.extends = [ config.extends ];

		for(var i = 0; i < config.extends.length; i++){

			if(!window.Meta.activities[config.extends[i]])
				throw "Cannot register fragment '" + name + "': parent fragment '" + config.extends[i] + "' not found."

			for(var k in window.Meta.activities[config.extends[i]])
				config[k] = window.Meta.activities[config.extends[i]][k];

		}

	}

	//Assign config
	window.Meta.activities[name] = config;

}

/*
 * Create activity shorthand
 */
window.Meta.CreateActivity = function(target, name, resume){

	if(!window.Meta.activities[name])
		throw "Activity '" + name + "' not registered.";

	var activity = document.createElement('meta-activity');
	activity.setAttribute('name', name);

	target.appendChild(activity);

	if(resume)
		activity.resume();

	return activity;

}

/*
 * Activity prototype
 */
window.Meta.ActivityPrototype = Object.create(window.Meta.FragmentPrototype);

//Get config method - can be overriden
window.Meta.ActivityPrototype._getConfig = function(name){

	return window.Meta.activities[name] || null;

}

/*
 * Register element
 */
document.registerElement('meta-activity', {
	prototype: window.Meta.ActivityPrototype
});
/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

/*
 * Events base
 */
window.Meta.EventsPrototype = {

	eventListeners: {},

	on: function(eventName, callback){

		if(!this.eventListeners[eventName])
			this.eventListeners[eventName] = [];

		this.eventListeners[eventName].push(callback);

	},

	off: function(eventName, callback){

		if(!this.eventListeners[eventName])
			return;

		var index = this.eventListeners[eventName].indexOf(callback);

		if(index >= 0)
			this.eventListeners[eventName].splice(index, 1);

	},

	fire: function(eventName, eventData){

		if(!this.eventListeners[eventName])
			return;

		for(var i = 0; i < this.eventListeners[eventName].length; i++)
			this.eventListeners[eventName][i].call(this, eventData);

	}

}

/*
 * Observing model
 */
window.Meta.ObservingProvider = function(data){

	this.addObserver(this, "eventListeners");

	if(data)
		for(k in data) this[k] = data[k];

};

window.Meta.ObservingProvider.prototype = Object.create(window.Meta.EventsPrototype);

window.Meta.ObservingProvider.prototype.addObserver = function(data, exclude){

	var self = this;

	if(data instanceof Function)
		return;

	if(data instanceof Array){

		Array.observe(data, function(changes){
			
			for(var i = 0; i < changes.length; i++){
				
				var change = changes[i];

				if(change.addedCount > 0 && change.object[change.index] instanceof Object)
					self.addObserver(change.object[change.index]);

			}

			self.fire("changed", self);

		});

		for(var i = 0; i < data.length; i++)
			this.addObserver(data[i]);

	} else if(data instanceof Object) {

		Object.observe(data, function(changes){
			
			for(var i = 0; i < changes.length; i++){
				
				var change = changes[i];

				if(change.type == "add" && change.object[change.name] instanceof Object)
					self.addObserver(change.object[change.name]);

			}

			self.fire("changed", self);

		});

		for(var i in data)
			if((exclude || []).indexOf(i) < 0)
				this.addObserver(data[i]);

	}

}
/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * @license MIT
 * 
 * More at http://www.meta-platform.com
 */

//Initialize global meta registry
if(!window.Meta) window.Meta = {};

window.Meta.channels = {};

window.Meta.Channel = function(config){

	this.listeners = [];
	this.config = config || {};

	if(this.config.name)
		window.Meta.channels[this.config.name] = this;

}

window.Meta.Channel.prototype.subscribe = function(handler){

	this.listeners.push(handler);

}

window.Meta.Channel.prototype.unsubscribe = function(handler){

	var i = this.listeners.indexOf(handler);

	if(i >= 0)
		this.listeners.splice(i, 1);

}

window.Meta.Channel.prototype.publish = function(message){

	if(this.config.onPublish)
		message = this.config.onPublish.call(this, message);

	for(var i = 0; i < this.listeners.length; i++)
		this.listeners[i](message);

}