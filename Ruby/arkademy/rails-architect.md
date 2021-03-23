## Rails Architect Masterclass

### DDD in rails

One great insight into why User become a god object is this code

```rb 
class User
  has_many :order
  
  def life_time_value
    # where orders have many order_items
    orders.map(&:total).sum
  end
end 

# The above is slow though, so we refactor
class User
  has_many :order
  
  def life_time_value
    orders
      .joins(order_lines: :product)
      .sum("products.price * order_lines.quantity")
  end
end 
```

As yourself, how much does the `life_time_value` have to do with a User?  Nothing except a user_id, it is order_lines, products, etc.  This is a property of an Order

```
class Order
  def self.life_time_value_of_user(user)
  end
end
```

### DDD in general

Remember "It is the developers (mis)understanding, not expert knowledge that gets released into production"

DDD Helps with the "Naming things" is hard problem
 - Look at how other experts communicate (look online, forum, facebook)

Build a "ubiquitous" language.  Model the domain similar to how the business discusses.  Techniques for this are Model Exploration Whirlpool, Domain Storytelling
 - Event Storming: Invite people with questions, answers, modeling enum these.  List big picture, process modeling then software design.  Chaotic beats sequential, more interaction is better, disagreements are ok.  Results in a Throw away model, something you can reference but aren't committing to
   - Domain Event: Past Test event relevant for business
   - Commands: Some decision made, can be in multiple domains
   - Aggregate (Actor): Things responsible for starting commands
  
#### Strategic DDD Patters

Bounded Context - Have Data and Responsible for changing and exposing
Context Map
Core & SubDomain

#### Tactical DDD Patterns

Value Object - Describe Things in system that aren't primitives.  Good example would be a SchoolYear, they have a begin and end and can be compared.  Other examples, VatRate, GrossAmount, Level, ID, ActiveSupport::TimeZone
Entity - (ActiveRecord::Base) - Object with unique identity, usually with mutable state.  (Bank Node)
Aggregate - Composed Objects defining a single consistent unit, the root is the Aggregate Root - (Order + Order Line).  Usually you should only operate on one aggregate at a time.  
  - Think about breaking up an order in a system into updating the pieces of the tickets.  
Domain Event
Design Patterns (repo, factory, strategy)

#### Normal Problems
 - Rails applications read data directly from primitive data in other bounded contexts instead of going through an interface.  This happens because of how easy it is for traversing relationships inside of ActiveRecord

#### Process Manager

A Function!  Given a set of commands, submit a command

 - https://blog.arkency.com/2017/06/dogfooding-process-manager/
 - https://blog.arkency.com/process-managers-revisited/


Great example is in a catering domain
 - Caterer - Can confirm or not a menu for a number of people at a timeframe
 - Customer - Presented with several menus, customer can accept many
 - Order Completed - When Customer and Caterer agrees to a menu and caterer agrees

Must handle out of order processes, at least once delivery, concurrency


