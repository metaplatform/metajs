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

window.Meta.ViewPrototype.template = function(){

	if(!this._template){

		//Create empty DIV and activate template
		try {

			var source = document.createElement('div');
			source.appendChild( document.importNode(this.content, true) );

		} catch(e){
			//Silent
		}

		//Compile template source
		this._template = Handlebars.compile(source.innerHTML, { strict: true });

		//Free empty DIV
		delete source;

	}

	return this._template.apply(this, arguments);

}

window.Meta.ViewPrototype.instance = function(target){

	var view = this;

	var templateEvents = [];

	var instance = {

		target: target,
		model: {},

		/*
		 * Bind event
		 */
		on: function(name, selector, handler, context){

			templateEvents.push({
				name: 		name,
				selector: 	selector,
				handler: 	handler,
				context:  	context
			});

		},

		/*
		 * Render template to target element
		 */
		render: function(){

			//Render template
			instance.target.innerHTML = view.template(instance.model);

			//Assign parent models and call ready
			var childs = instance.target.querySelectorAll("*");

			for(var i = 0; i < childs.length; i++){
				
				childs.item(i).parentModel = instance.model;

				if(childs.item(i).ready)
					childs.item(i).ready();

			}

			//Bind events
			function bindEvent(el, attrs){

				el.addEventListener(attrs.name, function(ev){
					ev.sender = el;
					attrs.handler.call(attrs.context || instance, ev);
				});

			}

			for(var x in templateEvents){

				var items = instance.target.querySelectorAll(templateEvents[x].selector);

				for(var i = 0; i < items.length; i++)
					bindEvent(items.item(i), templateEvents[x]);

			}

			//Update hashtable
			instance.$ = window.Meta.Utils.idHashmap(instance.target);

		},

		/*
		 * DOM function aliases
		 */
		getElementById: function(id){ return instance.target.getElementById(id); },
		querySelector: function(selector){ return instance.target.querySelector(selector); },
		querySelectorAll: function(selector){ return instance.target.querySelectorAll(selector); },

		/*
		 * Activate model observer
		 */
		observe: function(){

			Object.observe(instance.model, function(){
				instance.render();
			});

		}

	}

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
 * Handlebars helpers
 */
Handlebars.registerHelper('literal', function(options) {
	return options.fn();
});