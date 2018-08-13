## CH 6. Term Centric Search

Terms are the search phrase the user searches.  Sometimes its better to balance the impaces of terms rather than fields. 

##### Field Centric Approach Problems
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
 
 
 