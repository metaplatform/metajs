/*
 * MetaJS - MetaPlatform project
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz / Cryonix Innovations <www.cryonix.cz>
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

	window.Meta.fragments[name] = config;

	if(typeof config.view == "string"){
		
		if(!window.Meta.views[config.view])
			throw "MetaView '" + config.view + "' not registered.";

		config._view = window.Meta.views[config.view]

	}

}

/*
 * Fragment importer
 */
window.Meta.importFragment = function(name, ready){

	var link = document.createElement('link');
	
	link.rel = 'import';
	link.href = name + '.html'

	link.onload = function(e) {

		if(Meta.fragments[name])
			ready();

	};

	link.onerror = function(e) {
		console.log("Error importing fragment '" + name + "'", e)
	};
	
	document.head.appendChild(link);

}

/*
 * Fragment prototype
 */
window.Meta.FragmentPrototype = Object.create(HTMLElement.prototype);

window.Meta.FragmentPrototype.createdCallback = function(){

	var fragment = this;
	var name = this.getAttribute("name");
	
	if(window.Meta.fragments[name])		
		this.init();

	else
		window.Meta.importFragment(name, function(){
			fragment.init();
		});

};

window.Meta.FragmentPrototype.init = function(){

	var fragment = this;
	var name = this.getAttribute("name");
	var config = window.Meta.fragments[name];

	if(config._view)
		this.view = config._view.instance();

	if(config.constructor)
		config.constructor.call(this);

	this.shadowRoot = this.createShadowRoot();

	if(this.view){
		
		this.view.target = this.shadowRoot;
		this.view.observe();
		this.view.render();

	}

}

/*
 * Register element
 */
document.registerElement('meta-fragment', {
	prototype: window.Meta.FragmentPrototype
});