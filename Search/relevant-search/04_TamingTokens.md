## Chapter 4 - Taming Tokens

Search engines are little more than sophisticated token matching systems so the way that we interpret tokens is an important feature of the system.
It is up to the relevance engineer to tokenize the search in such a way that meaning is captured.  

`Should NOT map words to tokens, it should map meaning to user intent to tokens`

See Precision and Recall Def in /relevant-search.md

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
 