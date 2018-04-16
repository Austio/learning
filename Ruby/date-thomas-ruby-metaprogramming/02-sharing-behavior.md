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