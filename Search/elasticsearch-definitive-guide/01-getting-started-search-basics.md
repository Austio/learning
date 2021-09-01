[Getting Started](https://www.elastic.co/guide/en/elasticsearch/guide/current/intro.html)

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
 
### Search Result Keys
 - hits -> Results and metadata from the search in an array
 - hits.total -> how many returned
 - hits.hits -> actual result from the query
 - hits.max_score -> highest result in this search
 - took -> how many ms to run
 - shards.(total|failed|successful) -> How many shards helped in this query
 - timed_out -> Boolean, if took longer than timeout specified in q, default is no timeout
  
### [Multi-index](https://www.elastic.co/guide/en/elasticsearch/guide/current/multi-index-multi-type.html)  

Searches can specify the index/type that it needs inside of the query string
```
/_search -> all indexes
/us/_search -> only us
/us,gb/_search -> gb and us
/us,gb/users,tweets/_search -> gb/us and users
```

### Paging

from: amount to skip
size: total

```
Deep Paging in Distributed Systems

To understand why deep paging is problematic, let’s imagine that we are searching within a single index with five primary shards. When we request the first page of results (results 1 to 10), each shard produces its own top 10 results and returns them to the coordinating node, which then sorts all 50 results in order to select the overall top 10.

Now imagine that we ask for page 1,000—results 10,001 to 10,010. Everything works in the same way except that each shard has to produce its top 10,010 results. The coordinating node then sorts through all 50,050 results and discards 50,040 of them!

You can see that, in a distributed system, the cost of sorting results grows exponentially the deeper we page. There is a good reason that web search engines don’t return more than 1,000 results for any query.
```

### [Mapping](https://www.elastic.co/guide/en/elasticsearch/guide/current/mapping-analysis.html)

How does ES Map data? `/gb/_mapping/tweet`

Big distinction between exact and full text matches
 - exact -> easy, does it exactly match
 - full text -> subtle, how well does the document match within the full text based on intent
  - uses inverted index
  - UK should also return United Kingdom and UK and uk
  - Jump should return jumps, jump, jumping, maybe even leap
  
#### [Inverted Index](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html)

A list of unique words and the document they appear.  If we analyze these

The quick brown fox
Quick brown foxes

we would
 - pick the unique words [The, quick, brown, fox, Quick, foxes]
 - normalize the casing  [the, quick, brown, fox, foxes]
 - stem similar results  [the, quick, brown, fox] foxes -> fox
 
#### [Analyzers](https://www.elastic.co/guide/en/elasticsearch/guide/current/analysis-intro.html) 
Analysis helps us with this by going through and tokenizing the string and then anlyzing it to normalize results they encapsulate three functions
 - Character filters - Tidy up string before tokenizing (convert & to and, strip html)
 - Tokenizer - Split based on spacing, or even more granular
 - Token filters  - Each token is filtered where it can be deduped, lowercased, removed (a, and the), combined (jump/leap)
 
