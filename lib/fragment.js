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

	//Assign config
	window.Meta.fragments[name] = config;

}

/* ---------------------------------------------------------------------------
 * Fragment prototype
 -------------------------------------------------------------------------- */
window.Meta.FragmentPrototype = Object.create(HTMLElement.prototype);

/*
 * Get config method - can be overriden
 */
window.Meta.FragmentPrototype._getConfig = function(name){

	if(!window.Meta.fragments[name])
		throw "Fragment '" + name + "' not registered.";

	this.config = window.Meta.fragments[name];

}

/*
 * Component constructor - called when all imports are ready
 */
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

	//Render
	this.render();

	//Call ready method
	if(this.config.onReady)
		this.config.onReady.call(this, this);

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
	if(this.config.shadowRoot)
		this.view.configure(this.shadow, this.config.binding || {});
	else
		this.view.configure(this, this.config.binding || {});

	//Assign view params
	this.view.model = this.model;
	this.view.events = this.config.events || {};
	this.view.fragment = this;

}

/*
 * Render view shorthand
 */
window.Meta.FragmentPrototype.render = function(){

	if(this.view)
		this.view.render();

}

/*
 * Component constructor
 */
window.Meta.FragmentPrototype.attachedCallback = function(){

	var self = this;
	
	//Assign name
	this.name = this.getAttribute("name");

	//Get fragment config
	this._getConfig(this.name);

	//Import methods
	for(k in this.config)
		if(this.config[k] instanceof Function && ["onCreate"].indexOf(k) < 0)
			this[k] = this.config[k];

	//Create shadow root
	if(this.config.shadowRoot)
		this.shadow = this.createShadowRoot();
	
	//Handle imports
	if(this.config.import){

		window.Meta.Utils.importMany(this.config.import, function(){

			self._create();

		}, function(){
			
			throw "Imports for fragment '" + self.name + "' failed";

		})

	} else {

		self._create();

	}

};

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