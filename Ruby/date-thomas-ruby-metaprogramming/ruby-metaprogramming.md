### Intro

```ruby
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

#### 2 ways to change Self
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

  