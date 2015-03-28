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

window.Meta.channels = {};

window.Meta.Channel = function(config){

	this.listeners = [];
	this.config = config || {};

	if(this.config.name)
		window.Meta.channels[this.config.name] = this;

}

window.Meta.Channel.prototype.subscribe = function(handler){

	this.listeners.push(handler);

}

window.Meta.Channel.prototype.unsubscribe = function(handler){

	var i = this.listeners.indexOf(handler);

	if(i >= 0)
		this.listeners.splice(i, 1);

}

window.Meta.Channel.prototype.publish = function(message){

	if(this.config.onPublish)
		message = this.config.onPublish.call(this, message);

	for(var i = 0; i < this.listeners.length; i++)
		this.listeners[i](message);

}