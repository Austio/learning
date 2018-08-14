## [Relevant Search](https://www.manning.com/books/relevant-search)

[Good Seed Data](https://www.elastic.co/guide/en/kibana/current/tutorial-load-dataset.html)

### URLS

Can add jq on mac to make look less bad

|Use|Path|
|---|---|
|Show Mapping/Analysis Urls |GET /twitter/_mapping/type|
|Update Mapping|PUT /twitter/_mapping/type|

### Troubleshooting

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
