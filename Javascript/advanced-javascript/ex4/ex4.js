function Widget(width,height) {
	this.width = width || 50;
	this.height = height || 50;
	this.$elem = null;
}

Widget.prototype.render = function($where){
	if (this.$elem) {
		this.$elem.css({
			width: this.width + "px",
			height: this.height + "px"
		}).appendTo($where);
	}
};

function Button(/* ... */) {
/*
	...
	this.$elem = $("<button>").text(this.label);
*/
}

/*
Button -> render = function($where) {
	// call the parent render()
	// add a click handler -> onClick
}

Button -> onClick = function(evt) {
	console.log("...");
}

$(document).ready(function(){
	var $body = $(document.body);
	var btn1 = ...;
	var btn2 = ...;

	btn1.render($body);
	btn2.render($body);
});
*/