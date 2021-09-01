## Chapter 3 - Debugging

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
