## Mutations

### Field Object

type is the return but it is not always the same type that we will be passing in.  

```
fields: {
  addUser: {
    type: UserType,  //refers to type of data we will return from our function
    args: {
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      age: { type: new GraphQLNonNull(GraphQLInt) },
      companyId: { type: GraphQLString }
    },  
    resolve() {}
  }
}
type:

```

## Query

### Composition


Fields are just a path in the graph, a way to think of it is a property on a JS object.  If that field is also an object, you must provide selections of the fields to grab from that object. 

```
{
  field(0..many arguments) {
    field(0..many arguments
  }
  field1(0..many arguemnts)
}
```

### Response Object

Responses to queries are javascript objects, so you can't have multiple properties by same name at same level.  For example, say you were querying for 2 companies and wanted them returned flat like so

```
{ 
  company(id: "1") {
    id
    name
  }
  company(id: "2") {
    id
    name
  }
}
```

This would not work b/c company property is at same level.  To get around you can name the keys.  

```
{ 
  apple: company(id: "1") {
    id
    name
  }
  google: company(id: "2") {
    id
    name
  }
}
```

### Fragments

set of properties on a Type

```
{ 
  apple: company(id: "1") {
    ...companyDetails
  }
  google: company(id: "2") {
    ...companyDetails
  }
}

fragment companyDetails on Company {
  id
  name
}
```

Or in a more useful situation
```
{
  post1: post(_id: "03390abb5570ce03ae524397d215713b") {
    ...postInfo
  },
  post2: post(_id: "0176413761b289e6d64c2c14a758c1c7") {
    ...postInfo
  }
}

fragment postInfo on Post {
  title,
  content,
  author {
    ...authorInfo
  },
  comments {
    ...commentInfo
  }  
}

fragment commentInfo on Comment {
  content
  author {
    ...authorInfo
  }
}

fragment authorInfo on Author {
  _id, 
  name
}
```


### Field
Represents a property on a node in our system.  That property can connect to an edge to another node or list of nodes.


#### Resolve function
Resolves differences between incoming JSON and how to access data on backend.  I.e. mapping join tables or diverse data.


## Apollo vs Relay


## Mutations

Differences from query

 - Begin with mutation and you must specify the return fields from the mutation.
 - Are executed consecutively instead of in parallel when you provide multiple mutations.
 
