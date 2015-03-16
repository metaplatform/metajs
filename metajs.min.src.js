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
window.Meta.views = {};
window.Meta.fragments = {};
window.Meta.activities = {};

//Initialize config
if(!window.Meta.config)
	window.Meta.config = {};

//Initialize imported modules list
window.Meta.Utils._importedModules = [];

/* -----------------------------------------------------------
    utils.js
----------------------------------------------------------- */

/*
 * Module import
 */
window.Meta.Utils.import = function(name, onReady, onError){

	if( window.Meta.Utils._importedModules[name] )
		return onReady();

	var link = document.createElement('link');
	
	link.rel = 'import';
	link.href = (window.Meta.config.importPrefix || "") + name + '.html'

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

/* -----------------------------------------------------------
    view.js
----------------------------------------------------------- */

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
		var source = document.createElement('div');
		source.appendChild( document.importNode(this.content, true) );

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

			function bindEvent(el, attrs){

				el.addEventListener(attrs.name, function(ev){
					ev.sender = el;
					attrs.handler.call(attrs.context || instance, ev);
				});

			}

			//Bind events
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

/* -----------------------------------------------------------
    fragment.js
----------------------------------------------------------- */

/*
 * Fragment registration
 */
window.Meta.Fragment = function(name, config){

	//Assign defaults
	if(config.shadowRoot == undefined)
		config.shadowRoot = true;

	if(config.observeModel == undefined)
		config.observeModel = true;

	//Assign config
	window.Meta.fragments[name] = config;

}

/*
 * Fragment prototype
 */
window.Meta.FragmentPrototype = Object.create(HTMLElement.prototype);

//Get config method - can be overriden
window.Meta.FragmentPrototype._getConfig = function(name){

	if(!window.Meta.fragments[name])
		throw "Fragment '" + name + "' not registered.";

	this.config = window.Meta.fragments[name];

}

window.Meta.FragmentPrototype._create = function(){

	//Define model
	this.model = {};

	//Set default view
	if(this.config.view)
		this.setView(this.config.view);

	//Call create method
	if(this.config.onCreate)
		this.config.onCreate.call(this, this);

	//Fire create event
	this.fireEvent("create");

	//Observe view model
	if(this.config.observeModel)
		this.observe(this.model);

	//Render
	this.view.render();

}

window.Meta.FragmentPrototype.setView = function(view){

	if(typeof view == "string"){
		
		if(!window.Meta.views[view])
			throw "Meta view '" + view + "' not registered.";

		this.view = window.Meta.views[view].instance();

	} else {

		this.view = view.instance();

	}

	//Assign view model
	this.view.model = this.model;

	//Assign view target
	if(this.config.shadowRoot)
		this.view.target = this.shadow;
	else
		this.view.target = this;

}

window.Meta.FragmentPrototype.observe = function(target){

	var self = this;

	Object.observe(target, function(){
		self.view.render();
	});

}

window.Meta.FragmentPrototype.createdCallback = function(){

	var self = this;
	
	//Assign name
	this.name = this.getAttribute("name");

	//Get fragment config
	this._getConfig(this.name);

	//Create shadow root
	if(this.config.shadowRoot)
		this.shadow = this.createShadowRoot();
	
	//Handle imports
	if(this.config.import){

		window.Meta.Utils.importMany(this.config.import, function(){

			self._create();

		}, function(){
			
			throw "Import for fragment '" + this.name + "' failed";

		})

	} else {

		self._create();

	}

};

window.Meta.FragmentPrototype.fireEvent = function(name, data){

	var ev = new CustomEvent(name, data);
	
	ev.fragment = this;

	this.dispatchEvent(ev);

}

/*
 * Register element
 */
document.registerElement('meta-fragment', {
	prototype: window.Meta.FragmentPrototype
});

/* -----------------------------------------------------------
    activity.js
----------------------------------------------------------- */

/*
 * Activity registration
 */
window.Meta.Activity = function(name, config){

	//Assign defaults
	if(config.shadowRoot == undefined)
		config.shadowRoot = true;

	if(config.observeModel == undefined)
		config.observeModel = true;

	//Assign config
	window.Meta.activities[name] = config;

}

/*
 * Activity prototype
 */
window.Meta.ActivityPrototype = Object.create(window.Meta.FragmentPrototype);

//Get config method - can be overriden
window.Meta.ActivityPrototype._getConfig = function(name){

	if(!window.Meta.activities[name])
		throw "Activity '" + name + "' not registered.";

	this.config = window.Meta.activities[name];

}

/*
 * Register element
 */
document.registerElement('meta-activity', {
	prototype: window.Meta.ActivityPrototype
});