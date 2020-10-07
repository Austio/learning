## Production Ready Graphql

Discussion Points:
 - History BFF, Customizable, GQL, Rest
 - Client First Design
 - Interfaces/Unions, User example with having an Interface and Viewer
 - Expressive: Splitting out more fields, findById and findByName
 - Anemic Graphql
 - CourseGrained (bulk many) vs FineGrained (singular)
 - Contrast sharing types with inheritance vs interfaces composition 
 
Disagree
 - Providing both edges and edges/node

GQL: Specification for API query language and a server engine capable of executing said queries

#### Perspective/History

Netflix: API Redesign due to Substantial Limitations to one size fits all REST API, moved to customizable API
SoundCloud: Time to add new features and handle different needs, designed Use Cases and Backends for Frontends, 1 per client (android, mobile, ios, javascript)
Facebook: Frustrated by differences in data, wanted to use apps and server queries
  - Considerable amount of code to write both server to prepare and client to parse
  
#### Important Elements
Type System: Schema Definition Language, Canonical Representation of GQL schema.
Types and Fields: Can request types off of objects that are nested
Schema Roots: Query/Mutation/

Query Alias: Receive data in different format than defined
Enums: Define what is acceptable
Abstract Types: Allow clients to expect return type of a field to act in a certain way.
 - Interfaces allow us to define the contract that concrete types implement
 
```
interface Discount {
  priceWithDiscount: Price!
  priceWithoutDiscount: Price!
}

type Product implements Discountable {
  name: String!
  priceWithDiscount: Price!
  priceWithoutDiscount: Price!  
}

type GiftCard implements Discountable {
  code: String!
  priceWithDiscount: Price!
  priceWithoutDiscount: Price!  
}

# Now other fields can return discountable directly

type Cart {
  discountedItems: [Discountable!]!
}

query {
  cart {
    discountedItems {
      ... on Product { name }
      ... on GiftCard { code }
    }
  }
}
```

Union Types are a bit different, they don't deal with a certain contract, instead they return a disperate object

```
union CartItem = Product | GiftCard
type Cart {
  items: [CartItem]
}
query {
  cart {
    discountedItems {
      ... on Procuct { name }
      ... on GiftCard { code }
    }
  }
}
```

Directives: Declare that something should or shouldn't be included
 - [Big no-no in graphql ruby](https://graphql-ruby.org/type_definitions/directives)
 @skip - Skip section when true
 @include - include if true of GQL

#### Graphql Schema Design

`API's should be easy to use and hard to misuse`
`Make impossible States Impossible`
`The names are the API talking back to you, so listen`

Design First approach will (almost) always result in a better API.  OW very coupled to how things implemented internallly
 - Client First: Design with client in mind, first as early as possible.  This doesn't mean 'exactly for the client'
   - YAGNI: API's should be complete, but provide just enough features for clients to achieve the current use case
   - Not Influenced by implementation details, GQL entry to functionality, not your database
   - Building from DB doesn't make sense, schema coupled to implementation, very generic, exposes too much

Naming: 
 - Consistency is King, API Symmetry is also important
 - Principle of least astonishment
 - Be overly specific on members, in the Query example below, notice that you accidentally expose biling to the Viewer, which either forces you to return null for Viewers or make a New Type
 
```
type Query {
  viewer: User!
  team: Team
}

type Team {
  members: [User!]!
}

type User {
  name: String!
  billing: Billing
}
```

Better would be to expose user as an interface

```
type Query {
  user: User
  viewer: Viewer!
  team: Team
}

type Team {
  members: [User!]!
}

interface User {
  name: String!
}

type TeamMember implements User {
  name: String!
  isAdmin: Boolean!
}

type Viewer implements User {
  name: String!
  hasTwoFactorAuth: Boolean
  billing: Billing!
}
```

Descriptions: Icing on cake, query for what types represent, mutations for what they do

Schema Typing: Return Types when it make sense that are not scalars. 

```
eg 
type Product {
  # JSON Encoded string
  meta: String!
}

type ProductMetaAttribute {
  key: String!
  value: String!
}

type Product {
  metaAttributes: [ProductMetaAttribute!]!
}
```

Expressive Schemas:
 - Fields should do one thing well, avoid clever or generic fields
 - Avoid runtime logic that the schema can enforce
 - Avoid impossible states, use Complex object and input types to represent copuling between field/arguments
 - Use default values to indicate default behavior
  
 
```
# What if neither provided? 
findProduct(id: ID, name: String)

# Better
findById(id: ID)
findByName(name: String)
```

Stronger Schema:  Return full types when possible, combine things like cardNumber, cardDate, into a Card type that has a number and date
  
Specific VS Generic:  
 - Too generic tend to be optimized fo rno one and harder to reason about
 - Fields should often do one thing
 - A good indication of a field trying to do too much is a boolean field that is controller coupling
 - Another is sql like code for greater than, includes, etc, this causes server team to handle some serious performance edge cases inside a single resolver
  
```
# Too generic 
posts(first: Int!, includeArchived: Boolean): [Post!]!

# Better
posts(first: Int!): [Post!]!
archivedPosts(first: Int!): [Post!]!
```

Anemic Graphql: Designing schema purly as dumb bags of data instead of actions, use cases and functionality

```
# Query Example, plushing logic to client

Product: {
  price: Int!
  discounts: [Int!]!
}

# Works because client can reduce over the price and apply the discounts, but add tax and it blows up
Product: {
  price: Int!
  discounts: [Int!]!
  tax: Int!
}

# What we are missing here is
Product {
  totalPrice: Int!
}

### Mutation Example

type Mutation {
  updateCheckout(input: UpdateCheckoutInput): UpdateCheckoutPayload
}

input UpdateCheckoutInput {
  email: Email
  address: Address
  items: [ItemInput!]
  creditCard: CreditCard
  billing: Address
}

# Problems
 - Clients has to guess how to make a specific action
 - Cognitive overhead, what should they select
 - Focused on shape of internal data, don't indicate what is possible
 - Everything is nullable!

instead inputs should describe what we expect

type Mutation {
  addItemToCheckout(input: AddItemToCheckoutInput): UpdateCheckoutPayload
}

input AddItemToCheckoutInput {
  checkoutID: ID!
  item: ItemInput!
}

 - now strongly typed and obvious
 - Server side is easy
```

#### Relay Spec
 - Method to refetch with global ID
 - Connection concept to paginate
 - Specific structure for mutations

Offset -> Bad for big data sets, can be inaccurate due to list changes while offsetting
Cursor -> Stable ID that points to an item in the list

Connections return a connection type with two fields
 - Edge: Contains data we requested, but not directly, exposes things like the cursor
 - Node: The actual data in the edge
 
Some teams use the edge to encode relationship, like `role` at github 
 
```
products {
  edges {
    cursor
    node {
      name 
    }
  }
}

# Returns
{
  "data": {
    "products: {
      "edges: [
        {
          "cursor": "xyz----"
          "node": {
            "name": "Something"
          }
        }
      ]
    }
  }
}
``` 

Sharing Types

Sharing TOO MUCH rarely turns out well.  Good examples Imagine this Hierarch

```
type UserConnection { edges: [UserEdge!]! }
type UserEdge { node: User }
type User { login: String! }
type Organization { users: UserConnection!, teams: [Team] }
```

Now we add a concept of teams, natural inclination is to add members as a user connection

```
type Team { members: UserConnection! }
```

However, once the Type of User grows and diverges we are stuck, we can't add anything specific to the UserEdge about being an orgAdmin or teamLead

If instead we had opted for a 
```
type TeamMemberConnection { members: UserConnection! }
type OrgUserConnection { members: UserConnection! }

then the members of team and org user can diverge without issue

type Team { members: TeamMemberConnection! }
type Organization { users: OrgUserConnection!, teams: [Team] }
```

Another common example is sharing inputs, having a singular ProductInput for both create and update.

Global Identification
 - Opaque identifiers vs ID identifiers, opaque allows us to change how they are generated
 - Don't always need global identification
 
Nullability
 - Can it return null or not, a field cannot return null at runtime defined by using the bang symbol 
 - Returning null for nonnull is an error condition and the entire query is the null with an error
 
```
type Product {
  name: String!
  price: Money
}

type Shop {
  name: String
  topProduct: Product
}

query {
  shop {
    name 
    topProduct {
      name
      price
    }
  }
}
``` 

Now, in the above if we return null for name, it will cause the entire result to be null because both TopProduct and it's name are non-null

This illustrates how powerful nullability can be

Non-Nullability is great for
 - expression
 - allows clients to avoid defensive code
 
It is dangerous because
 - Non-null fields are harder to evolve, non-null to null is a breaking change
 - Very hard to predict what can be null or not, especially in distributed environments (timeouts, transient errors, rate limits)

When to use Non-Null
 - Arguments: Non-Null is almost always better to allow more predictable and understandable
 - Fields that return objects backed by db associations, network calls or things that can fail should be nullable
 - Simple scalars on objects that have been loaded by the parent are safe to be non-null
 - Rarely: For object types you are strongly confident will never be null

Abstract Types

The type below is a post, but it is sometimes a birthday and sometimes content
```
type SocialMediaFeedCard {
  id: ID!
  title: String!
  birthday: DateTime
  postContent: String
}
```

Instead split this into Abstract types
```
interface SocialMediaFeedCard {
  id: ID!
  title: String!
}

type BirthdayFeedCard implements SocialMediaFeedCard {
  id: ID!
  title: String!
  birthday: DateTime
}

type ContentFeedCard implements SocialMediaFeedCard {
  id: ID!
  title: String!
  content: String!
}
```

###### Union or Interface
 - Interfaces provide common shared *behaviors* (Starrable)
 - Unions when it can return different things (Search)

Don't overuse Interfaces, great for stronger contracts, but be sure that you are sharing common BEHAVIOR not common DATA.  
A good interface should mean something to the API Consumers.  Describes and provides a common way to do or behave like something instead of being or having something.
A good bad example is 'naming', when we don't have a strong meaning in the schema, naming will be awkward and meaningless, like an ItemInterface or ItemFields or ItemInfo

Abstract types giveus an easy way to evolve over time, but that is only true if we follow Liskov's Substitution Principle

###### Static Queries
 - Does not change based on variable, condition or state of th eprogram
 - Gives us insight into data requirements of clients
 - Can give the operations names
 - Known at build time, searchable
 - Caching
 
###### Mutations
 - Encouraged to accept Specific input types (CreateProductInput) and return Payload types (CreateProductPayload)
 
###### Fine-Grained or Course-Grained
 
Fine Grained meaning very small scope, pushes business logic to clients to composeCourse meaning it bundles up a lot for you 
 - eg, create a product, add a label to it then modify it's price
 - if that represents one action in the UI what do you do if 1 fails?
But you don't want a client to use 5 different 
 
Fine vs courses grained mutations depends on needs of client and ability of the server
 - Coarse-Grained create mutations
 - Fine Grained mutations to update an entity
  
How do you handle a case where you want multiple things to succeed at once or none at all?
 
###### Errors

 - Make sure that queries can handle new error cases as the schema evolves
 

Basic GQL Error is like this

```
{
  errors: [{
    "message": "Could not connect to product service.",
    "locations": [{ "line": 6, "column": 7 }],
    "path": ["viewer", "products", 1, "name"]
    // Can extend to add extensions
    "extensions": {
      "code": "SERVICE_CONNECT_ERROR"
    }
  }],
  "data": {
    "shop": {
      "name": "Shopy",
      "products": [
        { "id": 1000, "price": 100 },
        { "id": 1002, "price": null },
        { "id": 1003, "price": 103 }
      ]
    }
  }
}
```

This can happen for any number of reasons, in the above, it is because the second item in the array has a null price and it is non-null

But take mutations for example, if you wanted to return an error for say the equivalent of a 409, you can't do that easily because it 
 - Error information is limited
 - Errors are outside of the GQL Schema, no types 
 - Null propogation causes a whole slew of issues that will have to stay top of mind to prevent cascading errors
 
It is better to divide errors into two types
 - Developer/Client Errors (rate limit, wrong format, etc): Something went wrong during the query that the developer needs to handle on the client
 - User Errors: The user/client did something wrong (checkout twice)

Errors section is not great for handling user facing errors that are part of the business/domain rules

Some approaches to this are

*Errors as Data* 

1. Add a field for the possible errors in payload
 - pros: easy
 - cons: account may or may not be nil, clients don't have to query the errors field, so they don't know why accoutn in null
```
type SignUpPayload {
  emailWasTaken: Boolean!
 # nil if the Account could not be created
  accont: Account
}

// or as a type
type SignUpPayload {
  userErrors: [UserError!]!
  accont: Account
}

type UserError {
  message: String!
  field: [String!]
  code: UserErrorCode
}
```

2. Union / Result Type
pros: Very descriptive
cons: Clients have to query all cases and handle them

```
union SignUpPayload = SignUpSuccess | UserNameTaken | PasswordTooWeak

signup(email: 'foo@bar', password: 'biz') {
  ... on SignUpSuccess {
    account { id }
  }
  ... on UserNameTake {
    message
    suggestedUsername
  }
  ... on PasswordTooWeak  {
    meassage
    passwordRules
  }
}
```

Or as an interface so that you don't have to handle all concrete types initially

```
interface UserError {
  message: String!
  code: ErrorCode!
  path: [String!]!
}

type DuplicateProductError implements UserError {
  message: String!
  code: ErrorCode!
  path: [String!]!
  duplicateProduct: Product!
}

// Then query can eb

createProduct(name: "book") {
  product {
    name
  }
  userErrors {
    message
    code
    path
    ... on DuplicateProductError {
      duplicateProduct
    }
  }
}
```

IDEA: Mark Feature Flags and Such on types for the SDL

Naming Mutations
 - Idea: Adding @tags to the payload for documentation (@tags(names: ["product"]))
 - Nested: Have a parent field that has delete, create, etc under it
 - Consistency is all that really matters

Async Behavior

Shopify has the concept of returning a response that signals polling (Operation Status of PENDING, CANCELED, FAILED, COMPLETE)
This allows people to poll when they submit an async job

Shopify this does this really simply with a result that
 - Jobs identifiably by a global id and have two fields
 - 1. done, a boolean if async job is finished
 - 2. query: field that has the Query root type so clients can get the new state of things

```
// Another example
type Query { payment: Payment }

union Payment = PendingPayment | CompletedPayment

// OR opt fo ra union instead
type Operation {
  status: OperationStatus
  result: OperationResult
}

enum OperationStatus {
  PENDING CANCELED FAILED COMPLETED
}
```

###### Summary

- Use design first approach to schema development, discuss what is known about the domain and ignore impleementation details
- Design in terms of client use cases, don't think of data, types or fields
- Make schema's as expressive as possible
- Avoid the templation for generic or clever schemas

#### Implementing GQL Servers

At its core, GQL is a type system, a runtime and a way to access.

Resolvers are functions that fulfil the data access in a depth first search like way. Arguments are generall  
 1. The parent result
 2. The arguments
 3. The context
  
Code first vs Schema First
 - Code First: Graphql Ruby, create code that creates a schema that generates SDL
   - less familiar for graphql
   - benefit: you can define the schema and resolvers, the interface and runtime in the same place
   - eg: using a macro to build connections Connection.build(Types::Comment)
   - downside: tools that operate on the SDL can't understand your schema definitions
 - Schema First: Create the schema that generates the SDL, 
   - benefit is creating using a common language
   - downside: is provides no way to describe logic for the field
   - downside: separating schema description and what happens is a challenge as it grows and maintaining the types/mapped resolvers
   - downside: harder to define reusable tooling and type definition helpers
 - Annotation Based: Fully integrates with languages, graphql-spqr in java

Graphql can print the schema in ruby with `GraphQL::Schema::Printer.print_schema(MySchema)`

Summary
 - Build schema with code first approach
 - Check the schema into version control
 
#### Resolver Design

Graphql is an API Interface, not the source of truth for the business

 - Graphql
 - Domain Logic
 - Persistence
 
Great resolves contain very little code, it deals with user input, calls down to domain and then presents the results

Don't mutate the context object
 
On lookaheads, avoid tempatation to eagerly fetch additional child data because
 - GQL fields on query can be executed in parallel
 - As your schema evolves new queries that your resolve didn't expect can start making appearances
 
#### Schema Metadata

Adding tags for 'under development'
 - Code first allows macros
 - SDL First through directives which are 
 
oauth_scope metadata attribute lets us automate checks and publish

#### Multiple Schemas

Can have mulple schemas that are created at build or run time
 - build: literally have two schemas
 - runtime: through filters and schema masks
 
With visibility we don't want clients to see that fields or types exist in the schema.  

Github allows devs to use a `feature_flagged` to hide visability of certain fields
 - Great for enforcement
 - Not good for testing and tracking
 
I don't really like this because it is unnecessary unless you have types that are sensitive
 
```ruby
class FeatureFlagMask
  def call(schema_member, ctx)
    current_user = ctx[:current_user]

    if schema_memner.feature_flagged
      FeatureFlags.get(schema_member.feature_flagged).enabled?(current_user)
    else 
      true
    end
  end
end

MySchema.execute(query_string, only: FeatureFlagMask) PG 100
```

#### Multiple Schemas

Schema stitching is a thing

#### Testing

Test like an integration

Summary
 - Prefer code first frameworks over SDL
 - Keep GQL Layer as thin as possible, refactor logic to its own domain
 - Keep resolvers simple, don't mutate context
 - Modularize when it starts hurting
 - Test domain logic at domain layer, Integration tests best for gql
 - Use visibility filters for small schema variations at runtime
 
### Security

#### Rate Limiting
Complexity of Query Per Minute approach: Take the query cost and use that to rate limit uses
 - Calculate cost per field
 - Calculate cost per number of items
 - Graphql Ruby - Ahead of time analytisis api https://graphql-ruby.org/queries/ast_analysis.html

Server Time Per Minute Cost
 - Calculate time to execute in a middleware and use that
 
Expose the responses using Headers
 - x-ratelimit-limit: n
 - x-ratelimit-remainint: n
 - x-ratelimit-reset: epoch
 
Github Allows you to request the complexity calculation of a request ahead of time

```
query {
  // DryRun is don't calculate the query, just tell me what it would cost
  rateLimit(dryRun: boolean) {
    cost
    limit
    remaining
    resetAt
  }
  ...yourQuery
}
```

Shopify also returns this as part of a graphql extension

Downsides include
 - Gaming the system
 - Reliably being able to calculate what they want

Other ideas:  
 - You can set max depth of a query: https://graphql-ruby.org/schema/definition.html#default-limits
 - Max complexity per query
 - Node limit
 - Limit total bytesize on queries and variables to prevent DOS
 
#### Authentication
- Keep it out of graphql
  
#### Authoriziation
- API Scopes: Authorization on what fields they can acces
- Business logic: Can a user do X,Y,Z

Prioritize object authorization over field authorization
- Do this at the type level instead of the field level because it is very hard to track down all the ways an object can be accessed

### Performance and Monitoring

Most important for graphql is, did a query that used to take 200ms now take 500200ms
 - Log out When a query takes too long
 - Hash query and variables to keep track of historical requests

Think of query in three parts
 - Parse + Lexing
 - Validation + Static Analysis
 - Execution
  - Can attach a custom response timings as part of an extension

#### N+1 and Dataloader

When a query is colocated, it can be naie to want to pre-load a set of known queries that happen below it, however that it the responsibility of the subfield
-user
 - friends
   - bestFriends

It is easy in this situation to get where we perform 100's of single queries due to the separtion of concerns here

```
{
 user {
   friends(total: 1000) {
     bestFriends(total: 2000) {
       name
     }
   }
 }
}
```

Naive: just run the queries as the come up, this falls apart
Eager Load with Look ahead: Optimized but falls apart in complex scenarios due to the combunitorial nature of graphql
Data Loader = Lazy Load: Combine the N+ queries until the absolute last chance to need them, then fire them in 1 go when posisble

For Data Loader, you resolve the levels of graphql response by depth, then all requests for data go to a loader to ensure they are resolved well
Loader.load(key)-> Schedules the key to be loaded
Loader.perform -> Actually requests the data
 [Lee Byron Walkthrough of Code](https://www.youtube.com/watch?v=OQTnXNCDywA)

Downsides to DataLoader
 - Monitoring is harder
 - Execution model is harder to grok
 - Performance of a single field is a lie, they could batch up 1000+ requests but be super fast
 - Everything is now Async

## Caching

Freshness: The time since something is valid, usually through 'Cache-Control: max-age=3600' and 'Expires' headers. Great for static (assets)
Validation: Way clients avoid refetching when they don't know for sure if something is valid.  Usually through 'Last-Modified' (server sends an if-modified-since response) and 'ETag'

Http Caching just won't work, graphql posts requests, http will not cache posts.
 - similar to user based api

Application Caching
 - Shopify uses a cachable directive and if all fields are cachable it uses the cache
 - Key => user_id, query, every field cachable, variables, operation name, cache buster

```
field Foo @cacheable {
  name: String
}
```

Compiled Queries
 - Like persisted only compiled ahead of time to avoid rework at runtime

Summary
 - Caching is hard
 - Monitoring requires at field and query level rather than endpoint level
 - N+1 can be avoided with data loader
 - Caching is possible, but not as big of a deal as other mediums




Discussion:
 - I disagree with his "oh you can actually use http caching" mantra.  In development this would not work