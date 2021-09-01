curl -XGET localhost:9200/imdb/movies/_search?explain=true -H 'Content-Type:application/json' -d '
{
  "query": {
    "match": {
       "year": "1995",
    }
  }  
}
'