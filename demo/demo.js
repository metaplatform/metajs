function sanitize(input){

	var showOpen = new RegExp("<!-- SHOW", "g");
	var showClose = new RegExp("SHOW -->", "g");

	var tagOpen = new RegExp("<", "g");
	var tagClose = new RegExp("<", "g");

	return input.replace(showOpen, '').replace(showClose, '').replace(tagOpen, '&lt;').replace(tagClose, '&gt;')

}

function demoCode(source, target){

	document.getElementById(target).innerHTML = sanitize(document.getElementById(source).innerHTML);

}