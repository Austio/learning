### Memoization examples

Checkout process to apply an expensive discount at checkout.

d = Discount.new
d.discount([1,2,3])
d.discount([1,2,3])
d.discount([3,4,5])
d.discount([3,4,5])
```
class Discount
  def discount(*skus) 
    expensive_discount_method(skus)
  end

  private
  def expensive_discount_method(skus)
    puts "Expensive call"
    skus.inject{ |a,b| a+b }
  end
end

d = Discount.new
d.discount([1,2,3])
d.discount([1,2,3])
d.discount([3,4,5])
d.discount([3,4,5])
```

#### In memory hash

```
class Discount
  def initialize
    @lookup = {}
  end

  def discount(*skus)
    # nil is valid here, so this is better
    if @lookup.has_key?(skus)
      @lookup[skus]
    else
      @lookup[skus] ||= expensive_discount_method(skus)
    end  
  end

  private
  
  def expensive_discount_method(skus)  
    puts "Expensive call"
    skus.inject{ |a,b| a+b }
  end
end

d = Discount.new
d.discount([1,2,3])
d.discount([1,2,3])
d.discount([3,4,5])
d.discount([3,4,5])
```

#### Subclassing

```
class Discounter
  def discount(*skus)
    expensive_discount_method(skus)
  end
  
  private
    
  def expensive_discount_method(skus)  
    puts "Expensive call"
    skus.inject{ |a,b| a+b }
  end
end

class CachedDiscounter < Discounter
  def initialize
    super
    @lookup = {}
  end
  
  def discount(*skus)
    # nil is valid here, so this is better
    if @lookup.has_key?(skus)
      @lookup[skus]
    else
       @lookup[skus] ||= super
    end  
  end
end

d = CachedDiscounter.new
d.discount([1,2,3])
d.discount([1,2,3])
d.discount([3,4,5])
d.discount([3,4,5])
```

### With Generator

```
class Discounter
  def discount(*skus)
    expensive_discount_method(skus)
  end
  
  private
    
  def expensive_discount_method(skus)  
    puts "Expensive call"
    skus.inject{ |a,b| a+b }
  end
end

def memo(kls, method)
  lookup = {}
  
  Class.new(kls) do  
    define_method(method) do |args|
      if lookup.has_key?(args)
        lookup[args]
      else
        lookup[args] = super
      end
    end
  end
end

CachedDiscounter = memo(Discounter, 'discount')

d = CachedDiscounter.new
d.discount([1,2,3])
d.discount([1,2,3])
d.discount([3,4,5])
d.discount([3,4,5])
```

### With a ghost class
```
class Discounter
  def discount(*skus)
    expensive_discount_method(skus)
  end
  
  private
    
  def expensive_discount_method(skus)  
    puts "Expensive call"
    skus.inject{ |a,b| a+b }
  end
end

Discounter.class_eval do 
  @lookup = {}
  def discount(*args)
    if @lookup.has_key?(args)
      @lookup[args]
    else
      @lookup[args] = super
    end
  end
end

d = Discounter.new
d.discount([1,2,3])
d.discount([1,2,3])
d.discount([3,4,5])
d.discount([3,4,5])
```