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
fragment companyDetails on Company {
  id
  name
}

{ 
  apple: company(id: "1") {
    ...companyDetails
  }
  google: company(id: "2") {
    ...companyDetails
  }
}
  
```


### Field
Represents a property on a node in our system.  That property can connect to an edge to another node or list of nodes.


#### Resolve function
Resolves differences between incoming JSON and how to access data on backend.  I.e. mapping join tables or diverse data.


## Apollo vs Relay
