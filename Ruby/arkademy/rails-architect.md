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

Events - this happened (many can listen)
Commands - Do this (only 1 thing can do the command)

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


=======
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

#### Migration Strategies

 - Introduce Read Models first

Create a model with it's own storage, then in your services manipulate that along with the normal data stores.  This allows you to 

### Sagas and Process Managers

Allow you to listen to multiple bounded contexts to perform actions.  For example, realize payment after someone has selected a ticket and completed a payment.  

Code looks similar to below in rails events store

```
def perform(event)
  state = get_by_order_number(event.order.id)
  case event 
  when Orders::OrderShipped
    state.data[:shipped] = true 
  when Payments::PaymentAuthorized
    state.data[:payment_authed] = true
  else 
    raise ArgumentError
  end 
  
  # Here is the switch, check if it did the other two things and didn't complete
  if (state.data[:payment_authed] && state.data[:shipped] && !state.data[:completed])
    PaymentService.new.call(
      CapturePaymentCommand(order_number: state.order_number))
    state.data[:completed] = true
  end
end
```

[Example Process Manager](https://blog.arkency.com/2017/06/dogfooding-process-manager/): you have a Wedding Planner, Caterer and Customer
 - Order is not fillable until Caterer and Customer agree on a menu
 - Order is not filled until it is fillable and then Wedding Planner agrees

The events could look something like this
  CustomerConfirmedMenu(menu_id:1)
  CatererConfirmedMenu(menu_id:2)
  CustomerConfirmedMenu(menu_id:3)
  CatererConfirmedMenu(menu_id:1)
  CateringCustomerMatch(menu_id:1)
  WeddingPlannerConfirmedMenu(menu_id:1)
ProcessManager - CateringMatchProcessManager(menu_id:1)
  OrderConfirmed(menu_id:1)

