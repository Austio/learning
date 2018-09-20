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
 
 #### Local Table
 
 *CONCEPT*
 This is the thing that holds the parameters that are passed in.  Each scope has its own local table, which is why scopes don't have access to local variables that are external to their scope.
 
 so when compiling something like
 
|Code|LocalTable|
|---|---|
| def add_two(a,b)<br>  sum = a+b<br>end|sum, b<Arg>, c<Arg>|  

 - `<Arg>` Method/Block Argument
 - `<Rest>` Array of unnamed args using splat (*)
 - `<Post>` Standard argument after splt array
 - `<Block>` Proc object passed using the & operator
 - `<Opt=i>` Parameter with default value, i is an index into a new storage table saved along side the YARV snippet, not the actual local table
 
##### Local Table REST example 
Notice in the example below that we end up with a rest, post and 2 args due to the way that we compile the Ruby method.  
  
```
code = <<CODE 
def complex_formula(a, b, *args, c)
  a + b + args.size + c
end
CODE
  
puts RubyVM::InstructionSequence.compile(code).disasm

 == disasm: #<ISeq:complex_formula@<compiled>:1 (1,0)-(3,3)>=============
 local table (size: 4, argc: 2 [opts: 0, rest: 2, post: 1, block: -1, kw: -1@-1, kwrest: -1])
 [ 4] a<Arg>     [ 3] b<Arg>     [ 2] args<Rest> [ 1] c<Post>
 
 ```

##### Local Table OPT

With this one it is more complicated b/c there are two paths and ruby has to save the default value of the variable as it is compiled and then override if it receives a parameter.

```
code = <<CODE 
def complex_formula(a, b=5)
  a + b
end
CODE

puts RubyVM::InstructionSequence.compile(code).disasm

0000 putobject        5                                               (   1)
0002 setlocal_OP__WC__0 b
...
== disasm: #<ISeq:complex_formula@<compiled>:1 (1,0)-(3,3)>=============
local table (size: 2, argc: 1 [opts: 1, rest: -1, post: 0, block: -1, kw: -1@-1, kwrest: -1])
[ 2] a<Arg>     [ 1] b<Opt=0>
``` 

##### Local Table Keyword Args

To support keyword arguments there are a TON of extra instructions that have to execute in YARV

```
code = <<CODE 
def complex_formula(a, b: 5)
  a + b
end
CODE

puts RubyVM::InstructionSequence.compile(code).disasm

...
== disasm: #<ISeq:complex_formula@<compiled>:1 (1,0)-(3,3)>=============
local table (size: 3, argc: 1 [opts: 0, rest: -1, post: 0, block: -1, kw: 1@0, kwrest: -1])
[ 3] a<Arg>     [ 2] b          [ 1] ?          
``` 

### Chapter 3 - How Ruby Executes Your Code

YARV is a double stack implementations. 
 - tracks arguments for own internal instructions
 - tracks arguments for your ruby program
 
Implementation of yarv in ruby source is [insns.def](https://github.com/ruby/ruby/blob/08af3f1b3980c3392ee3a8701d2eee08dba9e6a4/insns.def) that file is compiled into vm.inc when ruby is built and that is handed to the compiler to handler
 
1. `rb_control_frame_t` is the control structure that manages this and it has
 - sp: stack pointer to the YARV stack
 - pc: program counter, location of current YARV instruction
 - self
 - type [METHOD, BLOCK, others]
2. A stack of `rb_control_frame_t`.  result of caller. The path YARV has taken through ruby program.

As YARV goes through the instructions of a program, it pushes

Default self is main, which has `to_s` to return main `ruby -e 'puts self'` => main

yarv steps for `puts 2 + 2`

Each step in the list increments the PC (program counter) to the next instruction and the SP is pointing to the last element in the array of stack

|yarv|stack|
|---|---|
|trace|[] - `set_trace_func`, there so that you can provide function for tracing all executions|
|putself|[self] - Pushes the main self on the top|
|putobject 2|[self, 2]|
|putobject 2|[self, 2, 2]|
|opt_plus|[self, 4] - opt_plus is optimized instruction|
|opt_send_simple <callinfo mid puts|[nil] - executes, calls put from c and then leaves nil on stack|
|leave||

#### Variable Handling in YARV

Relies on `getlocal` and `setlocal` in [insns.def file](https://github.com/ruby/ruby/blob/08af3f1b3980c3392ee3a8701d2eee08dba9e6a4/insns.def#L68).  Pretty cute name but is simply
 - get all the environment pointers, loop over all of them in closess order until we find a variable matching
 - `val = *(vm_get_ep(GET_EP(), level) - idx);` return the value of the ep minux this index
 
getlocal_OP__WC__0 => getlocal operand wildcard 0 OR `getlocal *, 0`
setlocal_OP__WC__0 => setlocal operand wildcard 0 OR `setlocal *, 0`

When you pass a scope gate, YARV stack gets some space for local variables declared in your scope.  It knows how many due to the `local table` during compilation.

In a simple case like the below. The stack would be

```
def display_string
  str = "Local Access"
  puts str
end
```

|Initial Stack||
|---|---|
|empty|<- *SP* Stack Pointer|
|special|<- *EP* Environment Pointer, Block Access|
|svar/cref|Pointer to special variables in current method ($!, $&) or to current Lexical Scope|
|str||

|yarv||
|---|---|
|putstring "Local Access"|Puts on top of stack (empty) increments SP|
|setlocal_OP__WC__0 2|Get value at top of stack, and save it in str local variable where str location = EP - 2|
|putself||
|getlocal_OP__WC__0 2
|opt_send_simple <callinfo!mid:puts argc:1>



