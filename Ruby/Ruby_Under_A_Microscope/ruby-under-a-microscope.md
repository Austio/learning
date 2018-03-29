### Chapter 1 - Tokenizing and Parsing

Good Commands
 - Ripper.
 
Ruby goes through 3 steps to get Ruby into machine code
 - Tokenizing: Turn sequence of text characters into ruby c tokens. Ripper.lex(code) || ruby -y simple.rb
 - Parsing: Convert series of tokens into phrases that ruby understands.  Ripper.sexp(code) || ruby --dump parsetree simple.rb
 - Compile Chapter 2

##### Tokenizing 
Happens in the c file parser_yylex

Examples (if, then, and, class, etc).  These are either reserved words in ruby or identifiers that are dynamic that normally refer to methods, classes, variables, etc.
Tokenizing has to consider things like 10.111 being a float and 10.times being number then method call

Ripper gives you an example of what this looks like, ruby does differently and has names like tIdentifier.
```ruby 
require 'ripper'
require 'pp'
code = <<STR
  10.times do |n|
    puts n 
  end
STR
puts code
pp Ripper.lex(code)

...[[[1, 0], :on_sp, "   "],
      line, column, type, value
```

##### Parsing
Ruby uses Bison (newer yacc yet another compiler compiler) grammar rules files to generate parser code that is used to convert the tokens using an algorithm.
parse.y has the grammar file and parse.c has the compiler code

The Algorithm is LALR Look Head Left Rightmost Derivation, it uses a table of rules that Bison generates that allows it to take a sequence of tokens and determine what c code to run on the match.
you can run a ruby file with -y to see detailed parsing information. `ruby -y simple.rb` in this folder

This is an example using a rule to parse She likes ruby to run printf.
```
SpanishPhrase: VerbAndObject el ruby {
  printf("%s Ruby\n", $1);
};
VerbAndObject: SheLikes | ILike {
$$ = $1; };
SheLikes: le gusta {
  $$ = "She likes";
}
ILike: me gusta {
  $$ = "I like";
}
```
Bison uses $$ to return a value to the parent or $1 to reference child generated value. 

Parsing a series of tokens [le gusta ruby], it would go left to right, find a match for the I, I Like, then push the rule VerbAndObject onto the stack and then match the full SpanishPhrase.

This is actually complicated a little b/c in the Ruby parser it compiles some things to ruby or c based on /% %/ or /%% %%/ statements in the parser.  This is so Ripper.rb can share the same rules with Bison

```
require 'ripper'
require 'pp'
code = <<STR
2 + 2
STR
puts code
pp Ripper.sexp(code)
```

Or to display the c generate AST `ruby --dump parsetree simple.rb`

### Chapter 2 Compiling

##### Compiling