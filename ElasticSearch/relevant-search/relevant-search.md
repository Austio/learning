## [Relevant Search](https://www.manning.com/books/relevant-search)

[Good Seed Data](https://www.elastic.co/guide/en/kibana/current/tutorial-load-dataset.html)

### Chapter 1 - What is relevancy

Definition: The Practice of improving search results `for users` by satisfying the `information needs` in the context of a particular `user experience` while balancing how raking `impacts business needs`.

When thinking about relevancy, consider these perspectives
 - What is content (tweets, beanie babies, news)
 - What sort of user (TechSavvy, professionals, shoppers)
 - What type of search (Japanese, Filled with Jargon, People)
 - What do users expect (Library and Catalog, shopping experience)
 - What does employer hope to get out of this
 - What are the valuable features of our content
 - What are the valuable signals that things are going well with search
 
To get full relevance you must identify valuable features of content and use those to computer relevance signals all within the context of feedback.

### Chapter 2 - Search Under the Hood

Analysis of a query has 3 steps
 - character filtering: ability to modify entire piece of text
 - tokenizing: chops up into stream of tokens
 - token filtering: modify/remove/insert tokens in the stream

### Chapter 3 - Debugging

 - Explaining behavior of the query

```
curl -X GET 'http://localhost:9200/INDEX/TYPE/_validate/query?explain' -d 'JSON'

curl -XGET "http://localhost:9200/*user*/user/_validate/query?explain" -H 'Content-Type: application/json' -d'
{
  "query": {
    "multi_match": {
      "query": "Something Searched"
    }
  }
}'
```

  - Lucene 
fieldWeight: how lucene computes the importance of the term in the field text
queryWeight: weight of the term in the users query

 - Calculating Weights with Similarity
similarity: lucene attaches statistics to documents relative to terms in the corpus.  Most are TF * IDF
TF: term frequency - how frequently a term occurs in a field (description: Aliens who do alien things).  Alien is 2 times so more likely about aliens
DF: document frequency - number of documents containing the term.  If it is more common it will have a higher DF
IDF: inverse document frequency -  1/DF - used to determine how rare is a word

TF * IDF b/c we want to know how many times something shows up in a field AND how rare that field is relative to matches in all of our documents.

Lucene dampens the td * idf in the following weights
TF Weight = sqrt(tf)
IDF Weight = log(numDox/ (df + 1)) + 1

fieldNorm: a term showing up in a field that is short is probably more relevant that one that shows up in a long description.  For instance, 1 alien word in a 3 sentence blurb vs in a 1000 page book.  To handle this they normalize 
fieldNorm = 1 / sqrt(fieldlength)

Ex example explain from these would be
```
0.4414702, fieldWeight in 31, product of: 
  1.4142135, tf(freq=2.0), with freq of: 
    2.0, termFreq=2.0 
  3.9957323, idf(docFreq=1, maxDocs=40) 
  0.078125, fieldNorm(doc=31)
```
 - NOTE: This uses classic similarity, not the new BM25

queryWeight: we also boost on the text the user is searching with.  Combo of
  - queryNorm: without boosting does not matter, attempts to make searches outside of this search comparrible.  there is much debate on if this is usefule
  - query Boosting: the amount of importance we give to one field `title^10`
[See Real Example of norm on a title boost of 10](./CH3:alienTitleBoosting.png)  

### Chapter 4 - Taming Tokens

Search engines are little more than sophisticated token matching systems so the way that we interpret tokens is an important feature of the system.
It is up to the relevance engineer to tokenize the search in such a way that meaning is captured.  

`Should NOT map words to tokens, it should map meaning to user intent to tokens`

These two are normally at odds
 - Precision: Percentage of documents in a result that are relevant (returned relevancy to what you were looking for)
 - Recall - Percentage of relevant documents returned in the result set (global correct vs returned correct)
 
For fruit example: say you want an apple and search for "red medium fruit"
 - Precision: if you return 4 fruit, 2 apples, a tomato and a bell pepper, your precision is 50%
 - Recall: If you have 5 apples total, and only 2 were returned in previous example, recall is 40%

To understand how ES receives a query, you must look at the way that it is tokenizing your string.  Put this for the example

```
curl -XPUT 'http://localhost:9200/my_library' -H 'Content-Type:application/json' -d '
{
  "settings": {
    "analysis": {
      "analyzer": {
        "standard_clone": {
          "tokenizer": "standard",
          "filter": [ "standard", "lowercase", "stop" ]
        }
      }
    }
  }
}
'
```

Here we are cloning the standard tokenizer and using the filters
 - standard tokenizer: splits on whitespace and punctuation
 - filter
   - standard: does nothing, placeholder
   - lowercase: ...
   - stop: removes common words (the, is)
   
Now we can use the analyze endpoint to see the stream from the updates

```
curl -XGET  http://localhost:9200/my_library/_analyze -H "Content-Type:application/json" -d'
{
  "analyzer": "standard_clone",
  "text":"Dr strangelove.  Or how i learned to stop worrying and love the bomb"
}'
```

Here is an example of how the english analyzer is created
 - english_possessive_stemmer => remove S's
 - english_stop => common words (this, the)
 - english_keywords => Protects words from being mangled by upstream stemmer
 - english_stemmer => walking/walk/walked treated as same word
 
```
curl -XDELETE "http://localhost:9200/my_library"

curl -XPUT "http://localhost:9200/my_library" -H "Content-Type:application/json" -d '
{ 
  "settings": { 
    "analysis": { 
      "filter": { 
        "english_stop": { 
          "type": "stop", 
          "stopwords": "_english_"
        }, 
        "english_stemmer": { 
          "type": "stemmer", 
          "language": "english"
        }, 
        "english_possessive_stemmer": { 
          "type": "stemmer", 
          "language": "possessive_english"
        }
      }, 
      "analyzer": { 
        "english_clone": { 
          "tokenizer": "standard", 
          "filter": [ 
            "english_possessive_stemmer", 
            "lowercase", 
            "english_stop", 
            "english_stemmer"
          ]
        }
      }
    }
  }
}
'

curl -XGET 'http://localhost:9200/my_library/_analyze' -H "Content-Type:application/json" -d '
{  
  "analyzer": "english_clone",
  "text": "flower flowers flowering flowered flower"
}  
'

// Has a match for flower at each position, pretty cool
{
  "tokens":[
    {"token":"flower","start_offset":0,"end_offset":6,"type":"<ALPHANUM>","position":0},
    {"token":"flower","start_offset":7,"end_offset":14,"type":"<ALPHANUM>","position":1},
    {"token":"flower","start_offset":15,"end_offset":24,"type":"<ALPHANUM>","position":2},
    {"token":"flower","start_offset":25,"end_offset":33,"type":"<ALPHANUM>","position":3},
    {"token":"flower","start_offset":34,"end_offset":40,"type":"<ALPHANUM>","position":4}
  ]
}

// Will get similar results for others
curl -XGET 'http://localhost:9200/my_library/_analyze' -H "Content-Type:application/json" -d '
{
  "analyzer": "english_clone", 
  "text": "silly silliness sillying sillied"
}  
'    
```

#### 4.2 Stemming: trading precision for recall

Lesson: To the extent possible, make tokens represent not just words but the meaning of words
 - that is why stemming is part of analysis, it groups common words (flower, flowers, flowering) so that they are recognized as the same meaning, which greatly increases recall and *may* increase precision but only to the degree that it is useful to the typical search user.
 - this can be taken too far where too many distinct meanings map to the same token (phonetic analyzer Dali lama and tall llama are same)
 

So english_stemmer doesn't consult a dictionary, it uses a heuristic to map common root words.  This is a Great example of sacrificing 'precision' for 'recall'.  You are wanting more relevant results in the document so you are willing to accept that searches for Maine may be mangled.

However you can take this to extremes, take the [Phonetic Analyzer](https://github.com/elastic/elasticsearch/tree/master/plugins/analysis-phonetic)
 - groups words together based on sound
 - allows finding even with misspellings
 
Once you download the plugin, you could setup in the following way
```
curl -XDELETE "http://localhost:9200/my_library

curl -XPUT "http://localhost:9200/my_library" -H "Content-Type:application/json" -d '
{
  "settings": {
    "analyzer": { 
      "phonetic": { 
        "tokenizer": "standard", 
        "filter": [ 
          "standard", 
          "lowercase", 
          "my_doublemetaphone"
        ]
      }
    }, 
    "filter": { 
      "my_doublemetaphone": { 
        "type": "phonetic", 
        "encoder": "doublemetaphone", 
        "replace": true
      }
    }
  }
}
'
``` 

This setting will do common standard/lowercase things.  Next it will them into a text representation of their sounds apple (APLS) bananas (PNNS)

This is great b/c misspellings will match, but it also causes strings like "Message from the Daili Lama" and "Massage from the tall llama" to match

#### 4.3 Precision and recall

A search engine is nothing more than a sophisticated token matching system and document-ranking system

 - The trick is fine tuning analysis to tightly control when various token representations map to an identical meaning
 - Analysis controls matching
 - Analysis manipulates TF * IDF by reducing the number of terms and combining them (run, running, run combined to run)


```
curl -XDELETE "http://localhost:9200/my_library"

curl -XPUT "http://localhost:9200/my_library" -H "Content-Type:application/json" -d '
{
  "settings": { 
    "number_of_shards": 1
  }
}
'

curl -X POST "http://localhost:9200/_bulk" -H 'Content-Type: application/json' -d'
{ "index" : { "_index" : "my_library", "_type" : "_doc", "_id" : "1" } }
{ "title" : "apple apple apple apple apple" }
{ "index" : { "_index" : "my_library", "_type" : "_doc", "_id" : "2" } }
{ "title" : "apple apple apple banana banana" }
{ "index" : { "_index" : "my_library", "_type" : "_doc", "_id" : "3" } }
{ "title" : "apple banana blueberry coconut" }
'

curl -X GET "http://localhost:9200/my_library/_search" -H "Content-Type:application/json" -d'
{
  "explain": true,
  "query": {
    "match": {
      "title": "apple"
    }
  }
}
'
```

This matches all 3, however the most important differences are the TermFrequency

 - 1: .30 total with termfreq of 2.23/idf of .3
   termFreq=5
 - 2: .23 total with termfreq of 1.73/idf of .3
   termFreq=3
 - 3: .15 total with termfreq of 1.0/idf of .3
   termFreq=1
 "tfNorm, computed as (freq * (k1 + 1)) / (freq + k1 * (1 - b + b * fieldLength / avgFieldLength))"


The engines TFXIDF heuristic help order documents that feature the search term the most prominently.  In other words, which document has the most "apple"-like contents.  It is a scale from very to not at all.
In the documents some are more about apples than others, this is signaled by the Term Frequency, how often apple or it's stems show up in the document.  Some are all about apples, some just have some apple in them as a side note and that is reflected in their TF score


The above has a relevance-ranking bug b/c if you index an additional document.
```
curl -XPUT "http://localhost:9200/my_library/_doc/4" -H "Content-Type:application/json" -d '
{
  "title": "apples apple"
}
'
```

You might expect this to be high, but apples != apple to the search engine right now so they are matched differently.

### Chapter 5 - Basic Multifield Search

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
   
###### Analyzing BestFields

 - best_fields is useful for when you want to create lopsided rankings where one field dominates others, follwed by another. 

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
          "min_shingle_size": 3, 
          "output_unigrams": "false"
        }
      }
    }
  }     
}
'
```
 
```
mostSearch = {
  "query": {
    "multi_match": {
      "query": "Patrick Stewart",
      "fields": ["title", "overview", "cast.name.;lk", "directors.name^0.1"],
      "type": "best_fields"
    }
  }
}
```
 
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
 -  
 