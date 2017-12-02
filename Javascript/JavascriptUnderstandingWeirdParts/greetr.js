(function(global, $) {

  Greetr = function(first, last, lang) {
    return new Greetr.init(first, last, lang)
  };

  Greetr.init = function(first, last, lang) {
    this.first = first || 'default';
    this.last = last || 'default';
    this.lang = lang || 'en';
  };

  var supportedLangs = ['en', 'es'];

  var greetings = {
    en: "Hello",
    es: "Hola"
  };

  var formalGreetings = {
    en: 'Greetings',
    es: 'Saludos'
  };

  var logMessages = {
    en: 'Logged In',
    es: 'El Logged In'
  }
  Greetr.prototype = {
    fullName: function() {
      return this.first + ' ' + this.last;
    },
    validate: function() {
      if (supportedLangs.indexOf(this.lang) === -1) {
        throw "Unsupported lang"
      }
    },
    greeting: function() {
      return greetings[this.lang] + ' ' + this.first;
    },
    formalGreeting: function() {
      return formalGreetings[this.lang] + ' ' + this.fullName();
    },
    greet: function(formal) {
      var msg = formal ? this.formalGreeting() : this.greeting();
      return msg;
    },
    setLang: function(lang) {
      this.lang = lang;
      this.validate();
      return this;
    },
    setGreeting: function(selector, formal) {
      $(selector).html(this.greet(formal));
      return this;
    }
  };
  Greetr.init.prototype = Greetr.prototype;

  global.Greetr = global.G$ = Greetr;

}(window, jQuery));
