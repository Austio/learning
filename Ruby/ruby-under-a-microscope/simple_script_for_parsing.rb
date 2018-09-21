str = "Quick fox, Lazy dog"
/fox/.match(str)

def search(str)
  /dog/.match(str)
  puts "Inside match is #{$&}"
end

search("dog")
puts "Outside is #{$&}"