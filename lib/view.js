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

window.Meta.ViewPrototype.instance = function(target){

	var view = this;

	var instance = {

		target: target,
		model: {},
		map: {},
		filters: {},
		conditions: {},
		bindings: {},
		events: {},
		eventsContext: null,

		/*
		 * Bind event
		 */
		on: function(name, selector, handler){

			instance.events[name + " " + selector] = handler;

		},

		/*
		 * Render template to target element
		 */
		render: function(){

			//Create template instance
			if(!instance.target._templateInstanced){

				instance.target.appendChild( document.importNode(view.content, true) );
				instance.target._templateInstanced = true;

			}

			//Render
			window.Meta.Template.render(instance.target, instance);

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

	return instance;

}

/*
 * Register element
 */
document.registerElement('meta-view', {
	prototype: window.Meta.ViewPrototype,
	extends: 'template'
});