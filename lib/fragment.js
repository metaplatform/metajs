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