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

	//Check auto-ready
	if(this.hasAttribute('ready'))
		this.ready();

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

window.Meta.FragmentPrototype.ready = function(){

	//Call ready method
	if(this.config.onReady)
		this.config.onReady.call(this, this);

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
			
			throw "Imports for fragment '" + self.name + "' failed";

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