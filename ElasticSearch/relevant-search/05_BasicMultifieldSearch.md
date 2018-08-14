## Chapter 5 - Basic Multifield Search

 - Signals map relevance scores to meaningful ranking criteria
 - Signal modeling builds fields that better map to criteria thats meaningful to users
 - best_fields is winner take all and allows for a tie_breaker to consider the others
 - most_fields takes a democratic approach and encourages multiple field matches

def - Signal: a component of the relevance scoring calculation corresponding to meaningful, measureable user or business information
def - Source Data Model: Structure of original data (database)
def - Signal Modeling: Data modeling for relevance picking fields and analyzers the way you would columns/keys/indexes for regular databases

See [Deep Dive on Practical Scoring](https://www.elastic.co/guide/en/elasticsearch/guide/current/practical-scoring-function.html)

When signal modeling you must answer these questions:
 - How do users intend to search these fields to obtain the needed information
 - What work needs to occur to improve or adjust that information
 
Fields exist to return a signal that measures information in the form of that fields relevancy score.  They are constructed to generate a similarity relationship between a query and a document. 

It is not possible to have relevant results in every direction but you cannot prematurely optimize.  You must ship, fail fast, analyze and reindex if need be to find where you need to better signal.

#### Pass 1 of 2 - No Signals
- Copying fields With 1 to 1 mapping with database fields mapped directly to fields on index

The issue here is that TF * IDF is the amount of times the term occurs for the documents field and how rarely the term occurs across all documents in this field
 - So the lucene below `(first_name:adam first_name:p first_name:smith)` will match a user whos first_name is `smith` very highly because that is crazy rare and they will be surfaced to the top
 - result: Smith P. Adam result WAY outweighs the real result of Adam P. Smith
 
```
usersSearch = "Adam P. Smith"

search = {
  "query": {
    "multi_match": {
      "query": usersSearch,
      "fields": ["first_name", "last_name", "middle_name"]
    }
}

// Lucene conversion
(first_name:adam first_name:p first_name:smith)|(...repeat middle_name)|(...repeat last_name)
```

#### Pass 2 of 2 - Name Signal
If people will be searching for First Middle Last it is valid to create a derived field that is `full_name`.  Then your search in lucene would want to be something like

```
max(first_name:adam first_name:p first_name:smith)|(...repeat middle_name)|(...repeat last_name) + full_name:"adam p smith"

search = {
  "query": {
    "bool": {
      "should": { 
        "multi_match": {
              "query": usersSearch,
              "fields": ["first_name", "last_name", "middle_name"]
        },
        "match_phrase": {
          "full_name": usersSearch
        }
      }
    }
  }
}

```

#### Data at Rest in Elasticsearch
How is nested data stored in ES?

```
httpResp = requests.get("http://localhost:9200/imdb/movie/%s" % spaceJamId)
doc = json.loads(httpResp.text)
print json.dumps(doc['_source'], indent=True)
```

Nested data is flattened.  Downside is that you lose the association with the child object that each field belongs to
 - More depth see www.elastic.co/blog/managing-relations-inside-elasticsearch for more details
```
{ 
  cast: [ 
    {
      name: "Michael Jordan",
      character: "Himself"
    },
    {
      name: "Danny DeVito",
      character: "My Swackhammer"
    }  
  ]
}

Is translated into multiple flattened parallel fields
cast.name = ["Michael Jordan", "Danny DeVito"]
cast.character = ["Himself", "My Swackhammer"]

ES Actually represents these as `inner objects` and flattens the array
cast.name = Michael Jordan Danny DeVito
cast.character = Himself My Swackhammer
```

#### Signal Modeling

Using our IMDB we determine that title, overview, cast.name and director.name are our possible signals for searching

userSearch = "Basketball with cartoon aliens"

##### Field Centric
def - Field-centric: `multi_match` scores each field in isolation relative to entire search term and then combines
  - takes userSearch against the title and against overview then combines
  - searches each field in isolation, as a discrete unit before combining field scores
 
To combine results uses either best_fields or most_fields
  - (MAX) best_fields (default): take highest scoring field, takes a tie_breaker parameter.  If title had the best score it would be
   - winner takes all search, runner ups discarded or discounted
   - score = Score.title + tie_breaker * (Score.overview + Score.cast.name + Score.directors.name)
   - works well when documents rarely have multiple fields that match the search string

  - (SUM) most_fields: boolean match summation.  Uses a `coord` (coordinating) factor to multiply which is the number of matching fields
   - every field gets a vote
   - score = (Score.overview + Score.title + Score.cast.name + Score.directors.name) * coord
   - works best when you expect mutliple fields from a document to match the search string
   
###### Analyzing BestFields best_fields

 - best_fields is useful for when you want to create lopsided rankings where one field dominates others, follwed by another. 
 - also when you want to decide ('is this search for a person' or 'is this search for a movie') if your signals are strong
 
Without help from us through boosting, best_fields can be unintuitive because
 - field scores don't reliably line up.  You can't reliably compare two different fields (directors.name vs case.name) becuase they have different term frequency, document lengths and idf.
   - because they don't line up, 2 could be a terrible score or director.name but .2 a great one for cast.name but director.name will win out of the box
   - like choosing max between a persons shoe size and height in feet.  They don't line up.
 - TF X IDF bias heavily toward rare terms, but use is most likely to be searching for regular items.
   - **when asking for coffee while shopping, you would be more happy to be brought to coffee aisle vs the ice cream isle that has a coffee flavored ice cream**

In our example below, stewart corresponds to a commonplace actor but a rare director.  It is far more likely the user is searching for the actor, not director but the tf x IDF does the opposite and rewards rareness.
 - iow - lopsided results towards obscure fields

```
mostSearch = {
  "query": {
    "multi_match": {
      "query": "Patrick Stewart",
      "fields": ["title", "overview", "cast.name", "directors.name"],
      "type": "best_fields"
    }
  }
}
```

You will get odd results because of how scoring happens in best fields.  It picks only one field.  
Below is a result and you can see that it matched on overview and had the words with and aliens in it.

```
9.522362, max of:
  9.522362, sum of:
    1.0380441, weight(`overview:with` in 315) [PerFieldSimilarity], result of:
      1.0380441, score(doc=315,freq=1.0 = termFreq=1.0
), product of:
        0.8842849, idf, computed as log(1 + (docCount - docFreq + 0.5) / (docFreq + 0.5)) from:
          263.0, docFreq 637.0, docCount
        1.1738796, tfNorm, computed as (freq * (k1 + 1)) / (freq + k1 * (1 - b + b * fieldLength / avgFieldLength)) from:
          1.0, termFreq=1.0 1.2, parameter k1 0.75, parameter b 53.298275, avgFieldLength 34.0, fieldLength
    8.484318, weight(`overview:aliens` in 315) [PerFieldSimilarity], result of:
      8.484318, score(doc=315,freq=2.0 = termFreq=2.0
), product of:
        5.5420475, idf, computed as log(1 + (docCount - docFreq + 0.5) / (docFreq + 0.5)) from:
          2.0, docFreq 637.0, docCount
        1.5308995, tfNorm, computed as (freq * (k1 + 1)) / (freq + k1 * (1 - b + b * fieldLength / avgFieldLength)) from:
          2.0, termFreq=2.0 1.2, parameter k1 0.75, parameter b 53.298275, avgFieldLength 34.0, fieldLength
```   

coord could be seen here and it would represent how many of all the tokens we pass in match ('patrick steward') (just patrick would be 1/2)       

       
def - Term-centric: scores each term in search against each field then combines
 - takes "Basketball" against title and against overview then combines, repeats for each word in query, then combines all results
 
###### Improving best_fields with boosting 
However, you can control search relevance with boosting to product intentional lopsided-ness inside of boosted fields.
 - This allows you to ensure that results are skewed towards the most important result type 
 - keep in mind that the boosting is not relative in any way to other fields, it is a simple multiplier

```
mostSearch = {
  "query": {
    "multi_match": {
      "query": "Patrick Stewart",
      "fields": ["title", "overview", "cast.name", "directors.name^0.1"],
      "type": "best_fields"
    }
  }
}
```
 
###### Improving best_fields with phrasing (bigrams, trigrams)
You can break out a shingle so that the token filter can generate subphrases.  For bigrams that would turn "Patrick Stewart Runs" into both Patrick Stewart and Stewart Runs

```
curl -X put localhost:9200/imdb -H 'Content-Type:application/json' -d '
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": { "type": "english" },
        "english_bigrams": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "standard",
            "lowercase",
            "porter_stem",
            "bigram_filter"
          ]
        }
      },
      "filter": {
        "bigram_filter": {
          "type": "shingle",
          "max_shingle_size": 2,
          "min_shingle_size": 2, 
          "output_unigrams": "false"
        }
      }
    }
  }     
}
'

// set bigrams on the settings
mappingSettings = {
  "movie": {
    "properties": {
      "cast": {
        "properties": {
          "name": {
            "type": "string",
            "analyzer": "english",
            "fields": {
              "bigrammed": {
                "type": "string",
                "analyzer": "english_bigrams"
              }
            }
          }  
        }
      },
      "director": {
        "properties": {
          "name": {
            "type": "string",
            "analyzer": "english",
            "fields": {
              "bigrammed": {
                "type": "string",
                "analyzer": "english_bigrams"
              }
            }
          }  
        }
      }
    }
  }
}

reindex(anlysisSettings, mappingSettings, movieDict)
```

```
mostSearch = {
  "query": {
    "multi_match": {
      "query": "Patrick Stewart",
      "fields": ["title", "overview", "cast.name", "directors.name^0.1"],
      "type": "best_fields"
    }
  }
}
```

###### Using tie_breaker to let other fields chime in 
So imagine a scenario where you would like to be able so support someone searching like `Star Trek Patrick Stewart` or

To handle this you would use the `tie_breaker` so that when the score is calculated it lets other fields have some influence in best fields outside of the best one.

score = title + tie_breaker * (overview + cast.name + director.name)

 - if tie_breaker were 1 it would essentially be a summation.
 

##### most_fields

If you have a multifacet search like `Star Trek Patrick Steward Wiliam Shatner`.  most_fields is basically saying
 - it SHOULD mention the title
 - it SHOULD mention the text in the movies overview
 - it SHOULD mention the cast members
 - it SHOULD mention the director name
 
The ideal document hits all 4.  

 - *REMEMBER* scores for fields aren't `really` comparable.  Despite bias towards multiple matches using a coord, you still need to boost to balance idf/term freq.
 - So you will almost certainly need to boost in order to make sure the results are not lopsided. 

It does have a huge pitfall, in many cases two strong signals shouldn't magnify a documents relevance, for example, a cast.name and director.name of Shatner will boost a score more than 2 cast members.  You probably want your shoulds to be more like
 - it SHOULD mention the title
 - it SHOULD match any person assocation with the film
 
Instaed of having specific ones with director/cast
 