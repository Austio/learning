str = "Quick fox, Lazy dog"
/fox/.match(str)

puts "Handling in Method"
def search(str)
  /dog/.match(str)
  puts "Inside match is #{$&}"
end
search("dog")
puts "Outside is #{$&}"
puts
puts "Handling in Block"
/fox/.match(str)
1.times do
  /dog/.match(str)
  puts "Inside match is #{$&}"
end
puts "Outside is #{$&}"


