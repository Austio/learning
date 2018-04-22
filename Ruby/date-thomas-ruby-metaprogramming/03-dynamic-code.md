### Dynamic Methods

### Blocks

 - ways to convert block to object
 - `&` in method signature converts the block to a proc using Proc.new
 
```
l = lambda { |a| puts a }
l = -> { |a| puts a }
l = Proc.new { |a| puts a }
l = Proc.new { |a| puts a }


def convert(&block)
  block
end

a = convert{|a| puts a}
a.call('foo')
``` 

### Lambda vs Proc

 - arity: lambda cares like a method call in ruby, proc uses parallel assignment
 - return: lambda returns from self, proc returns from enclosing method
 
```
def proc_method
  puts "before call"
  p = Proc.new { return }
  p.call  ### Returns from the proc_method, but is it enclosing and this is a proc 
  puts "after call"
end

puts "before method"
proc_method
puts "after method"  


def lambda_method
  puts "before call"
  l = lambda { return }
  l.call ### Returns from the lambda's block only, "after call" is put
  puts "after call"
end

puts "before method"
lambda_method
puts "after method"  
``` 

### Usage differences

 - Lambda: Like a method: used for anonymous methods
 - Proc: Link inline code:  iterators
 
 ```
 def method
  [1,2,3].each do |a|
    return a if a > 1
  end
 end

### Here you might expect method to return 2, this happens b/c ruby converts the block using &block, which uses proc.new so on the return it exits the enclosing `method` method
```

### Bindings

 - encapsulates: self, local variables, any associated block, return stack
 - 

 - You can get access to the context of bindings using `binding` and dig into those using `eval string binding`
```
class Simple
  def initialize
    @ivar = 'instance variable'
  end
  
  def call(param)
    local = "local var"
  
    binding
  end
end

### Access using eval, get self and all variables
b = Simple.new.call('my param') { "imablock" }
eval 'puts param', b # my param
eval 'puts local', b # local var
eval 'puts @ivar', b # instance variable
eval 'puts self', b # <Simple:0xjibberish....>
eval 'puts yield', b # imablock
```

 - The binding happens and construction time and hangs around until it is no longer used
 
```
def times(n)
  lambda {|x| x * n }
end

two_times = times(2)
two_times.call(3) # 6
```

```
# exercise
def count_with_increment(start, inc)
  lambda do
    puts start
    start = start + inc
  end
end

counter = count_with_increment(10,3)
```

### define_method

```
class Example
  def one
    def two
      'hiya'
    end
  end
end

a = Example.new
a.two #NoMethodError
a.one
a.two # hiya

# Example with memoizing
class Example
  def one
    def one
      puts @value
    end
    puts "calculating expensive method"
    @value = 100
    one
  end
end

a = Example.new
a.one #calculatin, #100
a.one #100
```
 

