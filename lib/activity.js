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
 * Activity registration
 */
window.Meta.Activity = function(name, config){

	//Assign defaults
	if(config.shadowRoot == undefined)
		config.shadowRoot = true;

	//Extends?
	if(config.extends){

		if( !(config.extends instanceof Array) )
			config.extends = [ config.extends ];

		for(var i = 0; i < config.extends.length; i++){

			if(!window.Meta.activities[config.extends[i]])
				throw "Cannot register fragment '" + name + "': parent fragment '" + config.extends[i] + "' not found."

			for(var k in window.Meta.activities[config.extends[i]])
				config[k] = window.Meta.activities[config.extends[i]][k];

		}

	}

	//Assign config
	window.Meta.activities[name] = config;

}

/*
 * Create activity shorthand
 */
window.Meta.CreateActivity = function(target, name, resume){

	if(!window.Meta.activities[name])
		throw "Activity '" + name + "' not registered.";

	var activity = document.createElement('meta-activity');
	activity.setAttribute('name', name);

	target.appendChild(activity);

	if(resume)
		activity.resume();

	return activity;

}

/*
 * Activity prototype
 */
window.Meta.ActivityPrototype = Object.create(window.Meta.FragmentPrototype);

//Get config method - can be overriden
window.Meta.ActivityPrototype._getConfig = function(name){

	return window.Meta.activities[name] || null;

}

/*
 * Register element
 */
document.registerElement('meta-activity', {
	prototype: window.Meta.ActivityPrototype
});