(function(global, $) {

  Greetr = function(first, last, lang) {
    return new Greetr.init(first, last, lang)
  };

  Greetr.init = function(first, last, lang) {
    this.first = first || 'default';
    this.last = last || 'default';
    this.lang = lang || 'en';
  };

  Greetr.prototype = {};
  Greetr.init.prototype = Greetr.prototype;

  global.Greetr = global.G$ = Greetr;

}(global, jQuery));
