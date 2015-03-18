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

/*
 * Events base
 */
window.Meta.EventsPrototype = {

	eventListeners: {},

	on: function(eventName, callback){

		if(!this.eventListeners[eventName])
			this.eventListeners[eventName] = [];

		this.eventListeners[eventName].push(callback);

	},

	off: function(eventName, callback){

		if(!this.eventListeners[eventName])
			return;

		var index = this.eventListeners[eventName].indexOf(callback);

		if(index >= 0)
			this.eventListeners[eventName].splice(index, 1);

	},

	fire: function(eventName, eventData){

		if(!this.eventListeners[eventName])
			return;

		for(var i = 0; i < this.eventListeners[eventName].length; i++)
			this.eventListeners[eventName][i].call(this, eventData);

	}

}

/*
 * Observing model
 */
window.Meta.ObservingProvider = function(data){

	this.addObserver(this);

	if(data)
		for(k in data) this[k] = data[k];

};

window.Meta.ObservingProvider.prototype = Object.create(window.Meta.EventsPrototype);

window.Meta.ObservingProvider.prototype.addObserver = function(data){

	var self = this;

	if(data instanceof Array){

		Array.observe(data, function(changes){
			
			for(var i = 0; i < changes.length; i++){
				
				var change = changes[i];

				if(change.addedCount > 0 && change.object[change.index] instanceof Object)
					self.addObserver(change.object[change.index]);

			}

			self.fire("changed", self);

		});

	} else {

		Object.observe(data, function(changes){
			
			for(var i = 0; i < changes.length; i++){
				
				var change = changes[i];

				if(change.type == "add" && change.object[change.name] instanceof Object)
					self.addObserver(change.object[change.name]);

			}

			self.fire("changed", self);

		});

	}

}