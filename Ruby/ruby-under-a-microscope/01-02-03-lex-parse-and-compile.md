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

Ruby 1.9+ compile the AST generated from above in the same fashion that C/Java do but it happens automatically. 

They introduced YARV (Yet another Ruby VM) to execute the compiled code.  It's primary differences from jvm are.
 -Ruby doesn't expose the compiler as a separate tool
 -Ruby doesn't compile all the way down to bytecode
 -It is a `stack oriented vm` so it maintains a stack of values that it can work on
  
You can see full output from Ruby Seq for parse/lex/compile example 02_lex_and_parse.rb steps are 
 -Take the AST and read the nodes, push YARV instructions to stack
 -Optimize the YARV instructions in places we can (+ to opt_plus, etc)
 -Execute
 
|AST|Does|YARV|
|---|---|---|
|NODE_SCOPE|creates the new scope of access, keeps table w/ values|Empty Box|
|NODE_FCALL|a function call|Push receiver, push arguments, call method/func|

For NODE_FCALL: all functions in ruby are methods b/c they are always associated with a ruby class so there is always a receiver.  HOWEVER, inside of ruby it must distinguish between functions and methods
 - methods have an explicit receiver
 - functions assume the current value of self
 
Example for compiling 
```
10 times do |n|
  puts n
end

# @ NODE_SCOPE (line: 1, code_range: (1,0)-(3,3))
# +- nd_tbl: (empty)
# +- nd_args:
# |   (null node)
# +- nd_body:
#     @ NODE_PRELUDE (line: 3, code_range: (1,0)-(3,3))
#     +- nd_head:
#     |   (null node)
#     +- nd_body:
#     |   @ NODE_ITER (line: 1, code_range: (1,0)-(3,3))
#     |   +- nd_iter:
#     |   |   @ NODE_CALL (line: 1, code_range: (1,0)-(1,9))
#     |   |   +- nd_mid: :times
#     |   |   +- nd_recv:
#     |   |   |   @ NODE_LIT (line: 1, code_range: (1,0)-(1,2))
#     |   |   |   +- nd_lit: 10
#     |   |   +- nd_args:
#     |   |       (null node)
#     |   +- nd_body:
#     |       @ NODE_SCOPE (line: 1, code_range: (1,9)-(3,3))
#     |       +- nd_tbl: :n
#     |       +- nd_args:
#     |       |   @ NODE_ARGS (line: 1, code_range: (1,13)-(1,14))
#     |       |   +- nd_ainfo->pre_args_num: 1
#     |       |   +- nd_ainfo->pre_init:
#     |       |   |   (null node)
#     |       |   +- nd_ainfo->post_args_num: 0
#     |       |   +- nd_ainfo->post_init:
#     |       |   |   (null node)
#     |       |   +- nd_ainfo->first_post_arg: (null)
#     |       |   +- nd_ainfo->rest_arg: (null)
#     |       |   +- nd_ainfo->block_arg: (null)
#     |       |   +- nd_ainfo->opt_args:
#     |       |   |   (null node)
#     |       |   +- nd_ainfo->kw_args:
#     |       |   |   (null node)
#     |       |   +- nd_ainfo->kw_rest_arg:
#     |       |       (null node)
#     |       +- nd_body:
#     |           @ NODE_FCALL (line: 2, code_range: (2,2)-(2,8))
#     |           +- nd_mid: :puts
#     |           +- nd_args:
#     |               @ NODE_ARRAY (line: 2, code_range: (2,7)-(2,8))
#     |               +- nd_alen: 1
#     |               +- nd_head:
#     |               |   @ NODE_DVAR (line: 2, code_range: (2,7)-(2,8))
#     |               |   +- nd_vid: :n
#     |               +- nd_next:
#     |                   (null node)
#     +- nd_compile_option:
#         +- coverage_enabled: true

0000 nop                                                              (   1)[Bc]
0001 putself                                                          (   2)[Li]
0002 getlocal_OP__WC__0 n
0004 opt_send_without_block <callinfo!mid:puts, argc:1, FCALL|ARGS_SIMPLE>, <callcache>
0007 leave                                                            (   3)[Br]
|------------------------------------------------------------------------
0000 putobject        10                                              (   1)[Li]
0002 send             <callinfo!mid:times, argc:0>, <callcache>, block in <main>
0006 leave            
```

So stepping through the AST that is generated more generially

|AST|YARV|ruby|
|---|---|---|
|NODE_SCOPE|0 nop|start of program|
|NODE_ITER|1 putobj 10, 2 send callin mid:time block|10.times do|
||above, yarv sees the that NODE_ITER goes to a second NODE_SCOPE meaning block||
|NODE_SCOPE|2 getlocal with getlocal_OP__WC__0 n| argument to block inner scope indicates a black parameter of n|
|NODE_FCALL NODE_ARRAY NODE_DVAR|opt_send_without_block <callinfo!mid:puts, argc:1, FCALL|ARGS_SIMPLE>, <callcache>|puts n|

Internally, this compile is in [compile.c](https://github.com/ruby/ruby/blob/9580586b63459318664e5309b8d19a626fff46f2/compile.c#L5838) in ruby and handles all the switches on what to push to yarv based on each possible path.  See page 42 of book to get more idea on this. 
 
 