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