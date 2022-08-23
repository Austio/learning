# Ruby with `rspec ./ruby_object_model_tests`
# nodemon -w ./ruby_splat_args_tests.rb -e "rb" --exec "rspec ./ruby_splat_args_tests.rb"

# https://www.bigbinary.com/blog/ruby-2-7-deprecates-conversion-of-keyword-arguments

puts "*"*50
puts "RUBY VERSION - " + RUBY_VERSION

case ENV["TEST_RUN"]

when "1"
  puts <<~DESC
    Demo: When method definition accepts keyword arguments as the last argument.
    def sum(a: 0, b: 0)
      a + b
    end
  DESC

  def sum(a: 0, b: 0)
    a + b
  end

  # In this case, we can add a double splat operator to the hash to avoid deprecation warning.
  sum(**{ a: 2, b: 4 }) # OK

  puts "Test 1: sum(a: 2, b: 4)"
  sum(a: 2, b: 4) # OK
  puts "Test 2: sum({ a: 2, b: 4 })"
  sum({ a: 2, b: 4 }) # Warned
  puts "Test 3: sum(**{ a: 2, b: 4 })"
  sum(**{ a: 2, b: 4 }) # OK
when "2"
  puts <<~DESC
    # When method call passes keyword arguments but does not pass enough required positional arguments.
    def sum(num, x: 0)
      num.values.sum + x
    end
  DESC

  def sum(num, x: 0)
    num.values.sum + x
  end

  # To avoid deprecation warning and for code to be compatible with Ruby 3,
  # we should pass hash instead of keyword arguments in method call.
  sum({ a: 2, b: 4 }) # OK
  sum({ a: 2, b: 4}, x: 6) # OK

  puts "sum(a: 2, b: 4)"
  sum(a: 2, b: 4) # Warned

  puts "sum(a: 2, b: 4, x: 6)"
  sum(a: 2, b: 4, x: 6) # Warned
when "3"
  puts <<~DESC
    # When a method accepts a hash and keyword arguments but method call passes only hash or keyword arguments.
    def sum(num={}, x: 0)
      num.values.sum + x
    end
  DESC
  def sum(num={}, x: 0)
    num.values.sum + x
  end

  # To fix this warning, we should pass hash separately as defined in the method definition.
  puts 'sum({ "x" => 4 }, x: 2)'
  sum({ "x" => 4 }, x: 2) # OK

  sum("x" => 2, x: 4) # Warned
  sum(x: 2, "x" => 4) # Warned
when "4"
  # When an empty hash with double splat operator is passed to a method that doesn't accept keyword arguments.
  #
  def sum(num)
    num.values.sum
  end

  numbers = {}
  sum(**numbers) # Warned

  # To avoid this warning, we should change method call to pass hash instead of using double splat operator.
  numbers = {}
  sum(numbers) # OK
end
