### Definitions
 - index(noun) -> like a database tableish, is a store of documents
 - index(verb) -> store a doc in an index (INSERT)
 - inverted index -> Allows search, is like a B-Tree index in sql
 - relevancy -> Score associated with a search result and is relative to other searches in the query
 
 

#### Paths
 - localhost:9200/_stats
 - localhost:9200/_cluster/stats
 - localhost:9200/_nodes/stats/jvm

#### Commands

 - (start as daemon) ./bin/elasticsearch -d
 - (retrieve data) get `/#{index_name}/#{type}/#{id}`
 - (insert data) put `/#{index_name}/#{type}/#{id}`
 - (delete data) delete `/#{index_name}/#{type}/#{id}`
 - (does the data exist) HEAD `/#{index_name}/#{type}/#{id}`
 
#### Lightweight Search (index seed.md first)
 
- get `/#{index_name}/#{type}/_search` 
```
{
  "took":3,
  "timed_out":false,
  "_shards":{"total":5,"successful":5,"failed":0},
  "hits":{"total":3,"max_score":1.0,"hits":[{
    "_index":"megacorp",
    "_type":"employee",
    "_id":"2",
    "_score":1.0,
    "_source": {
      "first_name" :  "Jane",
      "last_name" :   "Smith",
      "age" :         32,
      "about" :       "I like to collect rock albums",
      "interests":  [ "music" ]
    }
  }]
}
```
- get `/#{index_name}/#{type}/_search?q=last_name:Smith`

#### Query DSL

Send using json instead of query string

```
GET /megacorp/employee/_search
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}

curl -XGET 'localhost:9200/megacorp/employee/_search?pretty' -H 'Content-Type: application/json' -d'
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    }
}
'
```

 - filter
 - match - Tokenized match
 - match_phrase - Exact match
 - highlight - Highlight fields that are return in a <em>
 
```
"highlight": {
  "fields" : {
    "about" : {}
  }
}
```

 - aggs - Analytics / Aggregations - similar to group by in sql, generated on the fly based on the current query
```
{
  "aggs": {
    "all_interests": {
      "terms": { "field": "interests" }
    }
  }
}

// Result
{
   ...
   "hits": { ... },
   "aggregations": {
      "all_interests": {
         "buckets": [
            {
               "key":       "music",
               "doc_count": 2
            },
            {
               "key":       "forestry",
               "doc_count": 1
            },
            {
               "key":       "sports",
               "doc_count": 1
            }
         ]
      }
   }
}

// Query, find interests of people with last_name of smith
{
  "query": {
    "match": {
      "last_name": "smith"
    }
  },
  "aggs": {
    "all_interests": {
      "terms": {
        "field": "interests"
      }
    }
  }
}

// Find average age of people who have shared interests
{
    "aggs" : {
        "all_interests" : {
            "terms" : { "field" : "interests" },
            "aggs" : {
                "avg_age" : {
                    "avg" : { "field" : "age" }
                }
            }
        }
    }
}

"all_interests": {
     "buckets": [
        {
           "key": "music",
           "doc_count": 2,
           "avg_age": {
              "value": 28.5
           }
        },
        {
           "key": "forestry",
           "doc_count": 1,
           "avg_age": {
              "value": 35
           }
        },
        {
           "key": "sports",
           "doc_count": 1,
           "avg_age": {
              "value": 25
           }
        }
     ]
  }

``` 
 