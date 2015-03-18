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

//Initialize config
if(!window.Meta.config)
	window.Meta.config = {};

if(!window.Meta.config.importPrefix)
	window.Meta.config.importPrefix = "%module%.html";

//Initialize imported modules list
window.Meta.Utils._importedModules = [];

/*
 * Module import
 */
window.Meta.Utils.import = function(name, onReady, onError){

	if( window.Meta.Utils._importedModules[name] )
		return onReady();

	var link = document.createElement('link');
	
	link.rel = 'import';
	link.href = window.Meta.config.importPrefix.replace(/\%module\%/g, name);

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

/*
 * Sanitize HTML
 */
window.Meta.Utils.sanitizeHtml = function(input){

	var tagOpen = new RegExp("<", "g");
	var tagClose = new RegExp("<", "g");

	return String(input).replace(tagOpen, '&lt;').replace(tagClose, '&gt;');

}