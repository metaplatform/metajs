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
		configure: function(target, binding){

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

				el.addEventListener(event, function(ev){

					ev.sender = el;
					handler.call(instance.eventsContext || this, ev);

				});

				if(!el._boundEvents) el._boundEvents = [];
				el._boundEvents.push(event);

			}

			for(var e in instance.events){

				var key = e.split(" ");
				var event = key.shift();
				var selector = key.join(" ");

				var elList = instance.target.querySelectorAll(selector);

				for(var i = 0; i < elList.length; i++)
					bindEvent(elList.item(i), event, instance.events[e]);

			}

		},

		/*
		 * Render template to target element
		 */
		render: function(){

			//Validate
			if(!instance.template)
				throw "Template is not configured."

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
		instance.configure(target, binding);

	return instance;

}

/*
 * Register element
 */
document.registerElement('meta-view', {
	prototype: window.Meta.ViewPrototype,
	extends: 'template'
});