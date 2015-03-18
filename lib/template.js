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
 * Activity registration
 */
window.Meta.Template = {

	bind: function(targetNode, data){

		//Simple binding first
		for(var i in data){

			var elements = targetNode.querySelectorAll('*[id="' + i + '"], *[class~="' + i + '"]');

			if(data[i] instanceof Array){

				for(var e = 0; e < elements.length; e++){
					if(!elements.item(e)._template)
						elements.item(e)._template = elements.item(e).cloneNode(true);

					//Check current elements
					var removeList = [];
					var remainStack = {};

					for(var c = 0; c < elements.item(e).childNodes.length; c++){

						var child = elements.item(e).childNodes.item(c);
						var index = data[i].indexOf(child._model || undefined);

						if(index >= 0){
							
							if(!remainStack[index]) remainStack[index] = [];
							remainStack[index].push(child);

						} else {
							removeList.push(child);
						}

					}

					//Remove old elements
					for(var c = 0; c < removeList.length; c++)
						elements.item(e).removeChild(removeList[c]);

					//Bind new nodes and reorder old ones
					for(var sub = 0; sub < data[i].length; sub++){

						//Append old one
						if(remainStack[sub]){
							
							for(var r = 0; r < remainStack[sub].length; r++)
								elements.item(e).appendChild(remainStack[sub][r]);

						} else {

							//Create new one
							var row = elements.item(i)._template.cloneNode(true);
							window.Meta.Template.bind(row, data[i][sub]);

							while(row.childNodes.length > 0){
								console.log(row.childNodes.item(0));
								row.childNodes.item(0)._model = data[i][sub];
								elements.item(e).appendChild(row.childNodes.item(0));
							}

						}

					}

				}

			} else {

				for(var e = 0; e < elements.length; e++)
					elements.item(i).innerHTML = data[i];

			}


		}

	},

	_parseQuery: function(selector){

		var query = {
			selector: selector,
			type: 0,
			subtype: 0,
			property: null
		};

		if(selector.indexOf("@") >= 0){

			var separator = selector.indexOf("@");

			var attr = selector.substring(separator + 1);
			query.selector = selector.substring(0, separator);

			query.type = 1;

			if(attr.substr(0, 2) == "??"){
				query.subtype = 2;
				query.property = attr.substr(2);
			} else if(attr.substr(0, 1) == "?"){
				query.subtype = 1;
				query.property = attr.substr(1);
			} else {
				query.property = attr;
			}

		} else if(selector.indexOf("$") >= 0){

			var separator = selector.indexOf("$");

			query.type = 2;
			query.property = selector.substring(separator + 1);

			query.selector = selector.substring(0, separator);

		}

		return query;

	},

	_selector: function(target, selector){

		if(target.matches && target.matches(selector))
			return target;
		else
			return target.querySelector(selector);

	},

	_modifyNode: function(el, query, value){

		//Attribute?
		if(query.type == 1){

			if(query.subtype == 0){
				el.setAttribute(query.property, value);

			} else if(query.subtype == 1){
				
				if(value)
					el.setAttribute(query.property, value)
				else if(el.hasAttribute(query.property))
					el.removeAttribute(query.property);

			} else if(query.subtype == 2){

				if(value)
					el.setAttribute(query.property, '');
				else if(el.hasAttribute(query.property))
					el.removeAttribute(query.property);

			}

		//Property
		} else if(query.type == 2){

			el[query.property] = value;

		//HTML
		} else {
			
			el.innerHTML = value;

		}

	},

	_bindRoot: function(target, params, data, path){

		if(params.model instanceof Array){
			
			window.Meta.Template._bindArray(target, params, data, path);

		} else if(data instanceof Object){

			for(var key in data){

				window.Meta.Template._bindElement(target, params, key, data, data[key], (path ? path + "." : "") + key);

			}

		} else {
			throw "Template model must be an object or an array.";
		}

	},

	_bindElement: function(target, params, key, parentData, data, path){

		var selector = '*[id="' + key + '"], *[class~="' + key + '"], *[name="' + key + '"]';

		//Define selector
		if(params.map[path])
			selector = params.map[path];

		var query = window.Meta.Template._parseQuery(selector);

		query.key = key;
		query.path = path;

		//Conditional?
		if(params.conditions[path]){

			var condEl = window.Meta.Template._selector(target, query.selector);

			if(!target._conditionals) target._conditionals = {};

			if(!target._conditionals[path]){

				if(!condEl) return;
				target._conditionals[path] = condEl.cloneNode(true);
				target._conditionals[path]._nextSibling = condEl.nextSibling;
				target._conditionals[path]._parent = condEl.parentElement;

			}

			//Evaluate
			var result = false;

			if(params.conditions[path] instanceof Function)
				result = params.conditions[path].call(parentData, data, key, path, params);
			else if(data)
				result = true;

			//Add or remove
			if(result){

				if(!condEl){

					var condTpl = target._conditionals[path];

					if(condTpl._nextSibling)
						condTpl._parent.insertBefore(condTpl.cloneNode(true), condTpl._nextSibling);
					else
						condTpl._parent.appendChild(condTpl.cloneNode(true));

				}

			} else {

				console.log(condEl);

				if(condEl && condEl.parentElement)
					condEl.parentElement.removeChild(condEl);

			}

		}

		//Get element
		var el = window.Meta.Template._selector(target, query.selector);

		if(!el) return;

		//Handle
		if(data instanceof Array){

			window.Meta.Template._bindArray(el, params, data, path);			

		} else if(data instanceof Object && query.type != 2 && !(data instanceof Date)){

			for(var k in data){

				window.Meta.Template._bindElements(el, params, k, data[k], path + "." + k);

			}

		} else {

			//Ignore?
			if(params.map[path] === false)
				return;

			if(query.type == 0){

				//Get value
				if(params.filters[path])
					var value = params.filters[path].call(parentData, data, query);
				else
					var value = window.Meta.Utils.sanitizeHtml(data);

			} else {
				var value = data;
			}

			//Modify node
			window.Meta.Template._modifyNode(el, query, value);

		}

	},

	_bindArray: function(target, params, data, path){

		//Create template
		if(!target._template)
			target._template = target.cloneNode(true);

		//Define lists
		var removeStack = [];
		var remainStack = {};
		var lastElement = null;

		//Revise current items
		for(var c = 0; c < target.childNodes.length; c++){

			var child = target.childNodes.item(c);
			var index = data.indexOf(child._model || undefined);

			if(index >= 0){
				
				if(!remainStack[index]) remainStack[index] = [];
				remainStack[index].push(child);

			} else {
				removeStack.push(child);
			}

		}

		//Remove old elements
		for(var c = 0; c < removeStack.length; c++)
			target.removeChild(removeStack[c]);

		delete removeStack;

		//Bind new nodes and reorder old ones
		for(k = 0; k < data.length; k++){

			//Append old one
			if(remainStack[k]){
				
				for(var r = 0; r < remainStack[k].length; r++){

					if(remainStack[k][r] instanceof HTMLElement){
						window.Meta.Template._bindRoot(remainStack[k][r], params, data[k], path);
						window.Meta.Template._bindRoot(remainStack[k][r], params, { "_key": k }, path);
					}
					
					if(remainStack[k][r].previousSibling != lastElement)
						target.appendChild(remainStack[k][r]);

					lastElement = remainStack[k][r];

				}

			} else {

				//Create new one
				var row = target._template.cloneNode(true);

				window.Meta.Template._bindRoot(row, params, data[k], path);
				window.Meta.Template._bindRoot(row, params, { "_key": k }, path);

				while(row.childNodes.length > 0){
					
					lastElement = row.childNodes.item(0);

					row.childNodes.item(0)._model = data[k];
					target.appendChild(row.childNodes.item(0));				

				}

			}

		}

	},

	_bindEvents: function(target, events, context){

		var bindEvent = function(el, event, handler){

			if(el._boundEvents && el._boundEvents.indexOf(event) >= 0)
				return;

			el.addEventListener(event, function(ev){

				ev.sender = el;
				handler.call(context || this, ev);

			});

			if(!el._boundEvents) el._boundEvents = [];
			el._boundEvents.push(event);

		}

		for(var e in events){

			var key = e.split(" ");
			var event = key.shift();
			var selector = key.join(" ");

			var elList = target.querySelectorAll(selector);

			for(var i = 0; i < elList.length; i++)
				bindEvent(elList.item(i), event, events[e]);

		}

	},

	_bindExplicit: function(target, model, bindings){

		for(var selector in bindings){

			var query = window.Meta.Template._parseQuery(selector);
			var elList = target.querySelectorAll(query.selector);

			for(var i = 0; i < elList.length; i++){

				var el = elList.item(i);
				var data = bindings[selector].call(el, model, query);

				window.Meta.Template._modifyNode(el, query, data);

			}

		}

	},

	render: function(target, params){

		//Read params
		if(params.model){

			params.map = params.map || {};
			params.filters = params.filters || {};
			params.conditions = params.conditions || {};
			params.bindings = params.bindings || {};
			params.events = params.events || {};
			params.eventsContext = params.eventsContext || null;

		} else {

			params = {
				model: params,
				map: {},
				filters: {},
				conditions: {},
				bindings: {},
				events: {},
				eventsContext: null
			};

		}

		//Do model biding
		window.Meta.Template._bindRoot(target, params, params.model, null);

		//Do explicit bindings
		window.Meta.Template._bindExplicit(target, params.model, params.bindings);

		//Bind events
		window.Meta.Template._bindEvents(target, params.events, params.eventsContext);

	}

}