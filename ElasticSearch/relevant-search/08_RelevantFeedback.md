### Chapter 8 - Providing Relevant Feedback

#### 8.1 Relevant Feedback at search box

Providing information as users type can help them understand and refine their searches.  There are 3 ways
 - Search as you type
 - Search Completion
 - Postsearch Suggestions
 
##### Search as you type: Immediate Results
Goal to proactively provide matching documents in order to provide 
 - Relevance feedback:  As user sees results they can make search more broad or narrow to get qualified documents
 - Fast results: So that the user does not have to consciously submit a query before seeing result.  Users can choose to keep typing or select a resulting documnet 

One issue that can come up is the need to provide suggestions along side results.

This can cause some edges when both suggestion and results are sharing the same space
 - Confusing for users to discern between them
 - Confusing for users to know why a search surfaced
 - Hard to provide information about matching documents
 - Unless matching on 1 field (title) it is hard to provide feedback on why a search surfaced
 - Google eliminates this by only displaying search suggestions in query and surfacing results in result area

Search Suggestions Query 
```json 
{ "query": 
  { "match_phrase_prefix": 
    "title": "Star trek"
  }
}
``` 
 
##### Search Completion
Unsure Rich Results, Timely Completions and Suggestions with results

As a general rule, don't replace the users query with a `did you mean` query UNLESS it is a 0 results query 

Goal to usher user to better search queries.  Users intuitively type, reformulate and occasionally select the result
 - Users expect fast feedback, without speed the user will continue without aid
 - Users expect search suggestions with results, clicking a suggestion with 0 results reduces trust
 
There are 3 methods to build search completions
 - Past User input
 - Y
 - Z

###### Past User Input: 
 - Uses the corpus of all previous searches to make recommendations on new searches
 - Consider if you are in a `short-tail` with hundreds of searches or `long-tail` with millions.  With too few queries you have insufficient data to build a satisfactory completion experience.  With too many you have to discern importance. 
 - Consider staleness factor, for instance consider how e-commerce with frequently changing content has to deal with rotating contnet
 - Ensure no 0 length results
 
###### Current Input:
 - Uses a field that you analyze
 
Example using aggregations.  You want to use that because aggregations take the search context into account.
 - alternative to use aggs with `path_hierarchy` (star trek the motion picture, trek the motion picture, the motion picture, motion picture, picture)
 - aggs tax in distributed search.  Best in small corpus with text fields and relatively small set of unique terms
 - can also use completion type of type `completion` which is provided by elasticsearch
 

```
"settings": {
  "analysis": {
    "filter": {
      # 2 word bigrams (star trek, trek the, the next, next generation)
      "shingle_2": {
        "type": "shingle",
        "output_unigrams": "false"
      }
    },
    "analyzer": {
      "completion_analyzer": {
        "tokenizer": "standard",
        
        "filter": ["standard", "lowercase", "shingle_2"]
      }
    }
  }
}

# Mappings
"mappings": {
  "movie": {
    "properties": {
      "title": {
        "type": "string",
        "analyzer": "english",
        "copy_to":["completion"]
      },
      "completion": {
        "type": "string",
        "analyzer": "completion_analyzer"
      }
    }
  }
}

# Usage
{
  "query": {
    "match_phrase_prefix": {
      "title": {
        "query": user_input
      }
    }
  },
  "aggregations": {
    "completion": {
      "terms": {
        "fileds": "completion",
        "include": completion_prefix + ".*"
        # limits suggestions to those that begin with completion prefix
      }
    }
  }
}
```

Can also use completion analyzer, this allows you to enrich results returned

```
{ 
  "mappings": {
    "properties": {
      "title": {
        "type": string", "analyzer": "english"
      },
      "completion": {
        "type": "completion"
      }
    }
  }
}

doc = { "title": "star trek into darkness", "popularity": 32.15, ... }
doc["completion"] = {
  "input": [doc["title"]],
  "weight": int(doc["popularity"])
}
```

Post Search Suggestions

```
"mappings": {
  "movie": {
    "properties": {
      "genres": {
        "properties": {
          "name": {
            "type": "string",
            "index": "not_analyzed"}}},
      "title": {
        "type": "string",
        "analyzer": "english",
        "copy_to":["suggestion"]},
      "suggestion": {
        "type": "string"}}}}
        
GET /tmdb/_suggest
{ "title_suggestion": {
    "text": "star trec",
    "phrase": {
        "field": "suggestion"}}}

{'title_completion': [{'length': 9, 'offset': 0,
  'options': [
    {'score': 0.0020846569, 'text': 'star three'},
    {'score': 0.0019600056, 'text': 'star trek'},
    {'score': 0.0016883487, 'text': 'star trip'},
    {'score': 0.0016621534, 'text': 'star they'},
    {'score': 0.0016162122, 'text': 'star tree'}],
  'text': u'star trec'}]}     
  
# Improve on query
# collate gives alternate query to each suggestion that has results
# match_phrase more tightly constrains suggestions than a straight `query`
{ 
  "fields": ["title"],
  "query": {
    "match": {"star trec"}
  },
  "suggest": {
    "title_suggestion": {
      "text": "star trec",
      "phrase": {
        "field": "suggestion",
        "collate": {
          "query": {
           "inline": {
             "match_phrase: {
               "title": "{{suggestion}}"
             }
           }
          }
        }
      }
    }
  }
}               
{ 'title_completion': [{'length': 9, 'offset': 0, 'options': [
  {'score': 0.0019600056, 'text': 'star trek'},
  {'score': 0.0016621534, 'text': 'star they'}]}]}
```

# 8.2 Browsing Feedback

### Faceted browsing

Returning things like genres, gender, etc that the user can filter on
 - don't split on whitespace here, you want `science fiction` to not be `science` and `fiction`
```
GET tmdb/_search
{ "aggregations": {
    "genres": {
      "terms": {
        "field": "genres.name"}}}}


# User clicks Science Fiction
GET tmdb/_search
{"query": {
   "bool": {
     "filter": [{
       "term": {
         "genres.name": "Science Fiction"}}]}},
"aggs": {
  "genres": {
     "terms": {"field": "genres.name"}}}}
```

### Grouping Similar Documents 8.3.3

Sometimes it is nice to be able to split results into buckets.  This can be accomplished using aggregations

```
GET /tmdb/_search
{ "query":{
        "match":{
            "title": "star trek"}},
    "aggs": {
        "statuses": {
            "terms": {"field":"status"},
            "aggs": {
                "hits": {
                    "top_hits": {}}}}}}

{ 'buckets': [
  { 'doc_count': 82,
    'key':  'released',
      'hits': { 'hits': { 'hits': [
        { '_id':  '13475',
          '_index':  'tmdb',
          '_score': 6.032624,
          '_source': {
            'name':  'Star Trek: Alternate Reality Collection',
            'popularity': 2.73003887701698, ... },
                   /* more documents */ },
  { 'doc_count': 4,
    'key':  'in production',
      'hits': { 'hits': { 'hits': [
        { '_id':  '13475',
          '_index':  'tmdb',
          '_score': 6.032624,
          '_source': {
            'name':  'Star Trek: Axanar',
            'popularity': 3.794237016983887, ... },
                /* more documents */ },
         /* more groups */],
  'doc_count_error_upper_bound': 0,
  'sum_other_doc_count': 0}                    
```
