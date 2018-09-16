require "ripper"
require "pp"

file = "simple_script_for_parsing.rb"

ins = File.read(file)

puts "*"*50
puts "Tokens"
puts "*"*50

pp Ripper.lex(ins)

puts "*"*50
puts "S-expression tree"
puts "*"*50
pp Ripper.sexp(ins)

puts "*"*50
puts "ParseTree Code"
puts "*"*50
pp system("ruby", "--dump", "parsetree", file)
# pp system("ruby", "--dump", "parsetree_with_comment", file)

puts "*"*50
puts "Compiled Code"
puts "*"*50
pp system("ruby", "--dump", "insns", file)

# puts "*"*50
# puts "Full Parsing Output"
# puts "*"*50
# pp system("ruby", "--dump", "yydebug", file)