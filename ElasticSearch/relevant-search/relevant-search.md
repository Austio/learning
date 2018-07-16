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

Finally, a term showing up in a field that is short is probably more relevant that one that shows up in a long description.  For instance, 1 alien word in a 3 sentence blurb vs in a 1000 page book.  To handle this they normalize 
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
 