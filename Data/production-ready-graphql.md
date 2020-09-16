## Production Ready Graphql

Discussion Points:
 - 
 - Interfaces/Unions, User example with having an Interface and Viewer
 - Expressive: Splitting out more fields, findById and findByName
 

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
  