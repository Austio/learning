## CH 6. Term Centric Search

Terms are the search phrase the user searches.  Sometimes its better to balance the impaces of terms rather than fields. 

#### Field Centric Approach Problems
 - Cannot Account for cases in which multiple search terms match
 - 

1.  Albino Elephant Problem

 - Search results missing search termm counterituitively outranked results matching every serach term.
 - "Paul MCcartney Concert near San Franscisco" - Top result is a cd store with Paul, 2nd page is the concert you want
 - "Star Trek William Shatner Patrick Stewart" 
   - will match movies where shatner directed/cast member with same relevance as Patrick Director and Shatner Cast
   - Will overly boost movies Shatner directed b/c he only directed one (TF * IDF docFreq = 1)

// Demonstration of the Albino Elephant Problem: Which doc do you think will win here?
// NO Extra points for matching albino and elephant
```
curl -XPUT localhost:9200/albinoelephant/dox/1 -H 'Content-Type:application/json' -d '
{ "title": "albino", "body": "elephant" }
'

curl -XPUT localhost:9200/albinoelephant/dox/2 -H 'Content-Type:application/json' -d '
{ "title": "elephant", "body": "elephant" }
'

curl -XGET localhost:9200/albinoelephant/dox/_search?explain=true -H 'Content-Type:application/json' -d '
{
  "query": {
    "multi_match": {
       "query": "albino elephant",
       "type": "most_fields",
       "fields": ["title", "body"]
    }
  }  
}
'

"hits":[
  {"_index":"albinoelephant","_type":"dox","_id":"2","_score":0.5753642,"_source":
  { "title": "elephant", "body": "elephant" }},
  {"_index":"albinoelephant","_type":"dox","_id":"1","_score":0.5753642,"_source":
  { "title": "albino", "body": "elephant" }
]
```

This happens because in field centric the search string is shipped to each field for scoring then combined.  So title becomes
```
search string: albino elephant

// Both computed and calculated independently
(title:albino title:elephant) + (body:albino body:elephant) == score for two matches regardless of if you match elephant or albino in title
```

2. Signal Discordance
def: Signal Discordance 
- You are Still mired in details of database/api/parses/etc
- Disconnect between the signals from fine-grained search fields and users far more general mental model of the content.  
- Failure of signal modeling to express signals that mearsure ways users expect to search
 
Shows itself when field scores don't map to the users generalized expectations

#### Term Centric Approach

Takes users POV and vocuses on signals tied more closesly to query.  Signals can answer broader top-down questions

"basketball with cartoon aliens"
 - 1. Tokens: basketball cartoon aliens
 - 2. Search: for each term
 - 3. Combine Score: Per term combine the scores
 - 4. Combine all into overall
 
Uses `dismax` (DisunctionMaximumQuery) -> best_fields search where you pick the highest field score.  Here we will do that per search term.

When searching `star trek patrick stewart`  and overview having patrick stewart and title of star trek
field based dismax: albino elephant chooses overview field as result, and drops star trek match
(overview:star overview:trek *overview:patrick overview:stewart*) | (title:star title:trek title:patric title:stewart) 
term based dismax: each term given a chance
(overview:star | *title:star*) (overview:trek | *title:trek*) (*overview:patrick* | title:patric) (*overview:stewart* | title:stewart)



#### Running it into the ground

```
reindex data with bigrams from chapter 5

usersSearch = "star trek patrick stewart william statner"

query = {
  "query": {
    "query_string": {
      "query": usersSearch,
      "fields": ["title", "overview", "cast.name.bigrammed", "directors.name.bigrammed"]
    }
  },
  "size": 5,
  "explain": True
}
```
// Analyze is this
(title:start | overview:star) (title:trek | overview:trek).... no bigrammed fields
// You would maybe expect this
(title:william | overview:william | director.name.bigrammed:william shatner)

This is due to `field synchonicity` which is the capability to query multiple fields with identical search terms.  Or restriction that they be searched in the same way.  

In this case the bigrams were dropped b/c they william shatner is different than william so it is not congruent.  

Page 154. Some exceptional analysis of the lucene and explain of a query to find a signal discordance issue.  Identifies a rare term in a field causing high scores

#### Tuning Term Centric Search

`usersSearch = "star trek patrick stewart william statner"`
Term specific search for this looks like
 - coord * (Sstar + Strek + Spatric + Sstewart + Swilliam + Sshatner)
 
In each term's signal there is a dismax over every field search.  You can configure
 - to include the score of nonwinning fields in the dismax equation
 - weight/rebalance fields boostings


