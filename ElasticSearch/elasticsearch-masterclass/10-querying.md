## Query

GET /index/_search

```
{
  "query": {
    *yeild here*
  }
}

// Return all docs    
"match_all": {}
    
// Matching Computer
"match": {
  "name": "Computer"
}

// With the field professor.name in it
// NOTE: Is only a does this field exist on the document, not a check with empty?
"exists": {
  "field": "professor.name"
}

// must
// these items have to be present
"bool" {
  "must": [
    {"match": {"name": "Computer"}},
    {"match": {"room": "c12"}}
  ]
}

// must_not
// filter out things you don't want
"bool": {
  "must": [
    {"match": {"name": "accounting"}},
    {"match": {"room": "e3"}}
  ],
  "must_not": [
    {"match": {"professor.name": "bill"}}
  ]
}

// should
// what ideally should be there, nice to have    
"bool": {
  "must": [
    {"match": {"name": "accounting"}},
    {"match": {"room": "e3"}}
  ],
  "must_not": [
    {"match": {"professor.name": "bill"}}
  ],
  "should": [
    {"match":{"name": "foo"}}
  ]
}

// minimum_should_match
// tells elasticsearch the number of should conditions that ought match
"bool": {
  "must": [
    {"match": {"name": "accounting"}}
  ],
  "must_not": [
    {"match": {"professor.name": "bill"}}
  ],
  "should": [
    {"match":{"room": "e7"}},
    {"match":{"room": "e3"}}
  ],
  "minimum_should_match": 1
}
```



### multi_match
```

```
