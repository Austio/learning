## [Relevant Search](https://www.manning.com/books/relevant-search)

[Good Seed Data](https://www.elastic.co/guide/en/kibana/current/tutorial-load-dataset.html)

### Definitions

|Word|Definition|---|
|---|---|---|
|Precisions|Percentage of documents in a result that are relevant (returned relevancy to what you were looking for)|4|
|Recall|Percentage of relevant documents returned in the result set (global correct vs returned correct)|4|
|Boosting|Increases the relevance score of a subset of results|7|
|Filtering|Removes a subset of corpus of documents from consideration of a given search|7|
|Signals||?|

#### Precision and Recall
For fruit example: say you want an apple and search for "red medium fruit"
 - Precision: if you return 4 fruit of 2 apples, a tomato and a bell pepper, your precision is 50%
 - Recall: If you have 5 apples total, and only 2 were returned in previous example, recall is 40%

#### Term Frequency and Inverse Document Frequency
Used to score words based on their occurnce in the corpus and their length.  It is assumed that more unique words are better results when they are searched.

### Options
|name|context|definition|
|---|---|---|
|coord|boolean query|Adds bias towards documents that match all clauses|
|disable_coord|boolean query with coord|Removes bias towards matching all clauses.  Good when boost/bool is extra credit vs required|

### URLS

Can add jq on mac to make look less bad

|Use|Path|
|---|---|
|Show Mapping/Analysis Urls |GET /twitter/_mapping/type|
|Update Mapping|PUT /twitter/_mapping/type|

### Troubleshooting

#### Kibana: Login is Currently Disabled
https://discuss.elastic.co/t/kibana-6-login-is-currently-disabled/107675

### Steps:

#### Create custom analyzer and use it

 - NOTE: You must put for each type in the mapping when updatting analysis

curl -X put localhost:9200/imdb/_settings -H 'Content-Type:application/json' -d '
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

curl -XPUT localhost:9200/imdb/movie/_settings -H "Content-Type:application/json" -d '
{
    "properties": {
      "cast": {
        "properties": {
          "name": {
            "type": "text",
            "analyzer": "english",
            "fields": {
              "bigrammed": {
                "type": "text",
                "analyzer": "english_bigrams"
              }
            }
          }  
        }
      }
    }
}'
curl -XPUT localhost:9200/imdb/movie/_settings -H "Content-Type:application/json" -d '
{
    "properties": {
      "cast": {
        "properties": {
          "name": {
            "type": "text",
            "analyzer": "english",
            "fields": {
              "bigrammed": {
                "type": "text",
                "analyzer": "english_bigrams"
              }
            }
          }  
        }
      }
    }
}'
curl -XPUT localhost:9200/imdb/movie/_settings -H "Content-Type:application/json" -d '
{
    "properties": {
      "director": {
        "properties": {
          "name": {
            "type": "text",
            "analyzer": "english",
            "fields": {
              "bigrammed": {
                "type": "text",
                "analyzer": "english_bigrams"
              }
            }
          }  
        }
      }
    }
}'
