'use strict'

var Widget = {
  init: function (width,height) {
    this.width = width || 50
    this.height = height || 50
    this.$elem = null
  },
  render: function ($where) {
  	if (this.$elem) {
		  this.$elem.css({
			  width: this.width + 'px',
			  height: this.height + 'px'
		  }).appendTo($where)
	  }
  }
}

var Button = Object.create(Widget)

Button.layout = function (width, height, label) {
  this.init(width, height)
  this.label = label
  this.$elem = $('<button>').text(this.label)
}

Button.display = function ($where) {
	this.render($where)
	this.$elem.click(this.onClick.bind(this))
}

Button.onClick = function (evt) {
	console.log('Button ' + this.label + ' clicked!')
}

$(document).ready(function () {
	var $body = $(document.body)

	var btn1 = Object.create(Button)
	btn1.layout(90, 30, 'button #1') 
	btn1.display($body)

	var btn2 = Object.create(Button)
	btn2.layout(200, 100, 'button #2')
	btn2.display($body)
})
