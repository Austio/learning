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