### Intro

 - Objects: State + Behavior
 - Method calling: check self, go to class, then up super chain of classes until we find it 
 - Single Ton methods go on anonymous ghost class that is inserted between instance and class
 - Only 1 ghost class per instance/class pair, all additional anonymous methods go in that ghost class
 - Ruby class methods work exactly the same way as last 2 steps, so class mathods are singletons on ghost class
 - Ruby keeps reference to self at all times and it is the current_class

```
class Foo
  def one
    @var = 'x'
    two
  end 
  
  def two
    puts @var
  end
end

foo = Foo.new
```

#### Objects
 - Ruby uses OO in the sense that it is focused more on objects that classes encapsulate over UML/Class Oriented design.  
 - Should think of classes as represent objects that are changable
 - Instsances of classes have a pointer to the class that instantiated.  That class is where methods are stored.

#### Self
 - special variable that references current object
 - default receiver: current object is the default receiver, so any invokations without `.` (`foo.one`) are self 
 - where instance variables are found

#### 2 ways to change Self:  First is explicit reciever
Explicit Receiver (dot notation access) `foo.one`

Ruby performs these steps
 - sets foo as self
 - looks on foo for a method `one` and executes if found
 - in `one`: when it gets to `@var`, self is foo so it sets an instance variable on the instance foo
 - in `one`: when it gets to `two`, self is foo so it looks for the foo method and executes if found
 - in `two`: when it gets to puts @var, it looks for @var in self, which is foo, finds it, and puts @var value which is 'x' 
 
More succinct
 
#### Method calling sequence

```
animal = "cat"
``` 

animal.upcase
 - sets self to receiver (instance of foo)
 - look up method in receiver, does not find it
 - goes to super, finds in String class
 - invoke 
 
#### Eigenclasses 
 
```
animal = "cat"
animal.speak = 'meow'
```

The speak method is only on the instance of animal.  
Ruby achieves this by adding an anonymous/ghost/eigen class in between the instance of the object and it's parent

            String
               ^
               |
animal ->   EigenClass

This allows only animal to have the special method and still follow the standard Ruby Object Model.
Once you you have the EigenClass, the instance will put any special methods there, so adding `animal.purr = 'purr'` would go into the same one as animal.speak

#### Class Definitions and Constants

```

class Foo
  def bar
    'baz'
  end
  99
end

f = Foo.new

# Classes are just constants
puts defined?(Foo)
#> constant

# The class of a constant referencing a class is `Class`
Foo.class
#> Class

# Because classes are constants, you can reference them however you like
my_class = Foo
s = my_class.new
s.bar
#> baz
```

Classes are active code
```
puts "Before"
class Foo
  puts "Inside"
  def bar
    'baz'
  end
end
puts "After"

# Evaulate the code in a file through include, you will see that the file is Ruby being parsed.

#> Before
#> Inside
#> After
#> baz

# Because it is just ruby being parsed, you can assign variables to class assignments of last returned item
d = class Foo
  def bar
    'baz'
  end
  99
end 
puts d
#> 99
   
```

#### 2 ways to change self: second is a class definition
20:07
```
# Notice how self changes while inside the class Foo definition
puts "Before: self #{self}"
c = class Foo
  puts "Inside: self #{self}"
  def bar
    "baz: self #{self}"
  end

  # returning self so that c receives the value of the class
  self  
end
puts "After: self #{self}"

other = c
other.new.bar
```

#### Classes
 - don't require a name
 - don't have a name until you assign a constant to their definition
 - The act of assigning a constant to a class mutates anonymous class to reference the real value
 - Class methods don't exist
 
```
#assigning a constant to a class
cls = Class.new
puts cls

Me = cls
puts cls
puts Me
```

So when you see things like this
```
class Dave
  def self.say_hello
    "foo"
  end
end
```

It is setting methods on the instance of the Class object because when you start a class definitoin, self is set to the class.  So `self.method` is assigning to self, which at that time is the class due to the value of self chaing.

See class-methods-dont-exit.png

So when we define `say_hello` on self here.
 - self is Dave, which is an instance of an Object
 - its class is the Class method (that is why we can call new on Classes)
 - when we define the method `say_hello`, Ruby creates a ghost class in between Dave and the Class Class
 - this ghost class now has `say_hello` and it works the way that normal ruby looksups work