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
							key: i
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
						key: i
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