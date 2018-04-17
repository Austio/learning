### Sharing Behavior

 - Prototype Based - JS, no distinction between class and object
 - Class Based
 - Mixin
 
#### Prototype Inheritance in Ruby

 - Key is `clone()`: It copies the singleton Method (dup just the object)
 
```
animal = "cat"
def animal.speak  
  puts "Meow"
end

cloned = animal.clone
duped = animal.dup

animal.speak # Meow
cloned.speak # Meow
duped.speak  # NoMethodError: 
```  

```
animal = Object.new
def animal.num_feet=(newNumFeet)
  @num_feet=newNumFeet
end

def animal.num_feet
  @num_feet
end

animal.num_feet = 4
puts animal.num_feet # 4

new_animal = animal.clone
puts new_animal.num_feet # 4

def animal.with_feet(num_feet)
  new = clone #implicit self
  new.num_feet = num_feet
  new
end

parrot = animal.with_feet(2)
```

#### Classic Inheritance

 - right hand side of < is not class, it is an expression that returns a class
 - so can subclass from any expression
 - << is not inheritance
 
```
class Foo < Bar
end

b = Bar
class Foo < b
end

c = Baz

class Foo < (b || c)
end

#
Person = Struct.new(:name, :likes)
me = Person.new('austin', 'ruby')

class Erson < Struct.new(:name, :likes)
end

Son < Struct.new(:name, :likes) do 
end

Person.superclass #Struct
Erson.superclass #Class
```

<< is not inheritance, is is the same as defining a singleton method on your obj
 - Dave recommends against this b/c it can obscure where method belongs if too many class methods 
```
# see class-define-method.png
animal = "cat"

class << animal
  def speak
    puts "hi"
  end  
end

#equivalent to
def animal.speak
 puts "hi"
end


# Good Use Case: attr_accessor on class
class Animal
  @count = 0 #on the Animal class
  class << self
    attr_accessor :count
  end
end
```


