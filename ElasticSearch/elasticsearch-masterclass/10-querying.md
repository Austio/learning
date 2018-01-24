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
// to make a should a required match
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

// multi_match
// Query amongst multiple fields, relevancy is boosted for multiple field hits
"multi_match": {
  "fields": ["name", "professor.department"],
  "query": "accounting"
}

// match_phrase
// match entire phrase as a token to search against
"match_phrase": {
  "course_description": "from the business school"
}

// match_phrase_prefix
// allows for expansion on the last word in string
// [Poor Mans Autocomplete](https://www.elastic.co/guide/en/elasticsearch/reference/master/query-dsl-match-query-phrase-prefix.html)
"match_phrase_prefix": {
  "course_description": "from the business s"
}

// ranges
// gte, gt, lte, lt (greater than or equal, less than, etc)
// supports dates ("gte": "2013-08-27")
"range": {
  "students_enrolled": {
    "gte": 10,
    "lte": 30
  }
}

// Nested example
"bool": {
  "must": [
    {"match": {"name": "accounting"}}
  ],
  "must_not": [
    {"match": {"room": "e7"}}
  ],
  "should": [
    {
      "range": {
        "students_entrolled": {
          "gte": 10,
          "lte": 30
        }
      }
    }
  ]
}
```

## Filter
 - faster than query b/c does not do relevancy and caches
 - does not do relevancy matching
 - is nested inside query:bool
 
 
 



