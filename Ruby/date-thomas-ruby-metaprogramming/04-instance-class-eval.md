###

#### Eval

Executes a chunk of code

```
method = 'puts'

eval "#{method} 'howdy'"
```

#### Instance Eval

Like eval with w benefits 
 - block instead of a string
 - can be called with a receiver 
 
 
```
instance_eval do 
  puts self
end
# main

"cat".instance_eval do 
        puts self
      end
# cat

"cat".instance_eval do 
        puts upcase
      end
# CAT (implicit receiver of self, which is "cat")
``` 

You can see this even better in a class

```
class Thing
  def initialize
    @var = 'foo'
  end
  
  private
  
  def inner_secret
    "shhh"
  end
end

t = Thing.new
t.instance_eval { puts @var }  
# "foo"

# private method no long private b/c private just means only through implicit receiver
t.instance_eval { puts inner_secret }
```

Can also define methods inside of ruby

```
animal = "cat"

animal.instance_eval do 
  def speak
    puts "miow"
  end
end
```

Keep in mind that it is on the instance, so if you call it on a constant that is a reference to a class object it is the same logic

```
class Dave
  def self.howdy
    "howdy"
  end
end

class Dave
end

Dave.instance_eval do 
  def howdy
    "howdy"
  end
end
```

#### class_eval and module_eval

 - Like instance eval
 - can be called only on modules/classes
 - defines instance methods on the class
 
```
String.class_eval do 
  def say_hi
    "hi " + self
  end
end

# allows for
"miow".say_hi
``` 

#### instance_eval vs class_eval
 - Think of the name of instance_eval vs class_eval as the type of receiver that it is called on.  Class eval can be called on classes.  Instance eval on any instance
 - See 04-class-vs-instance-eval.png
 
When using instance_eval to define something ruby
 - creates or uses the anonymous ghost class (eigenclass)
 - sets self to the ghost class
 - adds the methods there
 - so when referencing they are not on the actual class, but the ghost class, so it misses on the main class and goes to the right to the ghost classs to find
 
When using class_eval to define something
 -  current class is set to the receiver
 
#### Why useful?

 - Breaking down security, can access internals to get... but don't do this unless have a super good reason
```
class Thing
  def initialize
    @var = 3
  end
end

t = Thing.new  

# Can access @var with block
t.instance_eval{@var}

# Can access with string
t.instance_eval("@var")

# can set as well...
t.instance_eval{@var = 5}
t.instance_eval{@var}
```

 - Remember that instance_eval changes self, so implicit recievers can cause issues
 
```
class Thing
  def initialize
    @var = 3
  end
end

t = Thing.new  

class Other
  def method(thing)
    thing.instance_eval do
      puts @var
      method2 #will blow up b/c implicit receiver of self, which is now the thing and does not have a method2 method
    end
  end
  def method2
    puts 'not gonna get here through method()'
  end
end
  
obj = Other.new
obj.method(t)
# 3
# NameError: undefined local variable or method 'method2'
``` 

 - can create methods without using closures (define_method uses a closure)
 
```
# My version
module Accessor
  module ClassMethods
    def my_attr_access(*args)
      args.each do |arg|
        class_eval("def #{arg};@#{arg};end;")
        class_eval("def #{arg}=(other);@#{arg}=other;end;")
      end
    end
  end


  def self.included(klass)
    klass.extend(ClassMethods)
  end
end

class Foo
  include Accessor
  my_attr_access :bar
end

# Daves much better prettier approach
module Accessor
  def my_attr_accessor(name)
    class_eval(%{
      def #{name}
        @#{name}
      end
      
      def #{name}=(other)
        @#{name}=other
      end
    })
  end
end

class Foo
  extend Accessor
  my_attr_access :baz
end

``` 