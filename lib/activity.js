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

window.Meta.activities = {};

/*
 * Fragment registration
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
 * Fragment prototype
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