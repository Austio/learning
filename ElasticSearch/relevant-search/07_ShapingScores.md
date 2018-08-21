### Chapter 7 - Shaping the Relevance Function

- Signals: In this chapter take on more of a quantitative tone.  
  - How recent was an article published.
  - How close is the restaurant
  - Presence of these indicates when to filter or boost
   
- Ranking Function: Filtering and boosting directly adjust this.? TODO


```
multiMatch = {
    "multi_match": {
      "query": "William Statner Patrick Stewart",
      "fields": ["title", "overview", "cast.name", "directors.name"],
      "type": "cross_fields"
    }
  }

mostSearch = {
  "query": multiMatch
}

search(query=mostSearch)
```

##### Non Boost Score Shaping
 - Sort Criteria: base on date/popularity/computed value/distance
 - Negative Boosting: 
 - Rescoring/Reranking: Second stage ranking with tweaks to top
 - Scripting the Score: Completely take control of scoring with script
 
 
### How to Boost
Type of Boost: When boosting you have to decide if you want to add or multiply the boost to the results
 - additive: stacks the boost on top of base query.  Has to be just enough to make it a little better relative to the scores.  .1 may not be enough to matter, 100 will essentially override the base 
 - multiplicative: scales base query. 1.2 gives 20% more oomph over other queries
  
Method of Boost: 
1. boolean query: boost through boolean clause on top of the base query using `bool`
 - Must abstracted away.  
 - Always additive
 - You add a SHOULD on top and tweak with a few knobs to manipulate
2. function query: directly inline using `function_score`
 - direct control
 - multiplicative or additive
 
 
#### Boolean Boost
 
```  
boolBoostSearch = {
  "query": {
    "bool": {
      "should": [
        multiMatch,
        { 
          "match_phrase": {
            "title": {
              "query": "star trek",
              "boost": 1 
            }
          } 
        }  
      ]
    }    
  }
}

search(query=boolBoostSearch)
```

Measures 2 signals, 
 - (boost) is this a star trek film, 
 - (base) are the query terms featured in the searched fields

You can get wonky resutls here due to the bias towards strong words with boost.  To get around that you can set a static boost on the query.
Another option is to move to more of yes/no scoring instead of IDF*TF for the star trek.  That is really more of a yes/no anyway.

#### Multiplicative Boost with Function queries

When updating these fudge factors (score shaping) ask `Does the formula account for how users and the business prioritize X`

In this example below, we want to multiple the score by 2.5 if the title matches star trek

```
functionBoostSearch = {
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query": "William Shatner Patrick Stewart",
          "fields": [
            "title",
            "overview",
            "cast.name",
            "directors.name"
          ],
          "type": "cross_fields"
        }
      },
      "functions": [
        {
          "weight": 2.5,
          "filter": {
            "match": {
              "title": "star trek"
            }
          }
        }
      ]
    }
  }
}

search(query=functionBoostSearch)


#To match multiple functions
"functions": [
  {
    "weight": 2.5,
    "filter": {
      "match": {
        "title": "star trek"
      }
    }
  },
  {
    "weight": 0.25,
    "filter": {
      "match": {
        "title": "Cars"
      }
    }
  }
]
  
# To match only a specific term
"functions": [
    {
      "weight": 2.5,
      "filter": {
        "match_phrase": {
          "title": "star trek"
        }
      }
    }
  ]
}  
```

### Score Shaping Strategies Implementation 187
When given a criteria ask "How exactly do i measure that"

 - (190) Turn off `coord` using `disable_coord` when doing a bool but you don't care about when multiple in bool match vs don't
 - (192) In mapping, turn off `norms` { enabled: False } in fields to prevent weird boostings on tf, for instance when searching actors but getting boosts b/c a movie only has a couple of actors
 - (195) wrap query in `constant_score` to ignore TF * IDF
 - When using `field_value_factor` to boost based on input (like movie rating, page views), dampen when it makes sense (like page_views, sometimes a few pages get millions of views but most only have a few, is the million+ a million times more relevant?)
 - (198) decay usage
 
```
usersSearch = 'patrick stewart'
query = {
    'query': {
        'bool': {
            'disable_coord': True,
            'should': [
                {'match_phrase': {
                    'title_exact_match': {
                        'query': SENTINEL_BEGIN + ' ' + usersSearch + ' ' + SENTINEL_END,
                        'boost': 1000,
                    }          
                }},
                {
                   'function_score': {
                        'query': {
                            'constant_score': {
                                'query': {
                                    'match_phrase': {
                                        'names_exact_match': SENTINEL_BEGIN + ' ' + usersSearch + ' ' + SENTINEL_END
                                    }
                                },
                                'boost': 1000.0
                            }            
                        },          
                        'functions': [
                        {
                             "gauss": {
                                "release_date": {
                                    "origin": "now",
                                    "scale": "5500d",
                                    "decay": 0.5
                                }
                            }
                        },
                        {
                            "field_value_factor": {
                             "field": "vote_average",
                             "modifier": "sqrt"
                            }
                        }
                        
                        ]
                    }                    
                },
                {'multi_match': {
                   'query': usersSearch,  #User's query
                    'fields': ['overview', 'title', #C
                               'directors.name', 'cast.name'],
                    'type': 'cross_fields'                                
                 }},
                
            ]
        }
    },
    'size': 5,
    'explain': True
}
search(query)             
```            
