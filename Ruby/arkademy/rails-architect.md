## Rails Architect Masterclass

Setup App

```
rails new -m https://railseventstore.org/new ddd_app
```

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

#### Breaking Apart

Questions you can ask to get a better design
 - naming of fields: how is encrypted password related to last login.  What about to newsletter_id and billing_address
 - naming: suffixes, prefixes, infixes - address_*, bank_*
 - coupling in updates - are they related or incidental to be on the same form, do we need transactional integrity?
 - referential integrity - can i delete something on a calendar without affecting orders, reporting, sales, if so it is probably a different things

#### Better Design

How do you keep contexts
 - Prevent one domain from directly referencing another (associations)
   - Direct reading causes us to have no or few boundaries, everything is coupled
   - no interfaces to consume or expose data, so we don't know what we have to adhere to or can assume
 - Publish from one context and consume in another

Where do you want complexity?
 - When you write data or when you read data?
   - Write is like complex push, pull is complex reading

Read Models
 - do not belong to bounded contexes
 - different than presenter, more a materialized view


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

Bounded Context
Context Map
Core & SubDomain

#### Tactical DDD Patterns

Value Object - Describe Things in system that aren't primitives.  Good example would be a SchoolYear, they have a begin and end and can be compared.  Other examples, VatRate, GrossAmount, Level, ID, ActiveSupport::TimeZone
Entity - (ActiveRecord::Base) - Object with unique identity, usually with mutable state.  (Bank Node)
Aggregate - Composed Objects defining a single consistent unit, the root is the Aggregate Root - (Order + Order Line).  Usually you should only operate on one aggregate at a time.
  - Think about breaking up an order in a system into updating the pieces of the tickets.
Domain Event
Design Patterns (repo, factory, strategy)

### Event Sourcing in general
 - [Make it click](https://blog.arkency.com/one-simple-trick-to-make-event-sourcing-click/)
 - [It is Transferable](https://blog.arkency.com/event-sourcing-is-a-transferable-skill/)

Normally you will split something that was doing 1 thing (check logic, manipulate state) into two independent steps.

This is really just event programming applied to applications

Sourcing: The domain part will publish events when something happens
 - Supply a Product
 - Add Item to Card

Then listeners subscribe to those events and map in the state to data stores

[From Martin Fowler](https://martinfowler.com/articles/201701-event-driven.html)
 - Event Notification: When you alert that something happened in order to notify another area of the system
 - Event-Carried state transfer: Notify + Bring forward the before/after state
 - Event-Sourcing: Series of events that can be reapplied to get the current state
 - CQRS: Separate Data structures for reading and writing

#### Event Sourcing Downsides
 - no Rails Console in production
 - Data Migrations.... there are none
 - Huge mindset change
 - Need separate model for reportin
 - Lack of tooling (mysql is standard)

# TODO
 - Implement Aggregate, Value Object, Read Model, Deploy to Heroku
 - pick something like Blog, Commenting