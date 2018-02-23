What is elasticsearch
 - Search Documents
 - Insert/Delete/Analyze/Index/Retrieve
 
How does it work?
  Tokenizes the words and creates inverted index
  - Inverted Index - Maps words to document location where they occur (think index in book)
  
  Relevancy -> Number of results returned based on the inverted index, more results = greater relevancy
  
  
Map to db terminology

Elasticsearch|DB
--- | --- 
Field|Column
Document|Row
Type|Table
Index|Database

DB: A Database has Tables, Tables have a bunch of Rows that have data associated with Columns
ES: Indexes have Types, those types contain a bunch of Documents that have Fields

When we insert a document in elasticsearch it is called 'Indexing' the document

### Indexing
PUT /{index}/{type}/{id}
{
  "field": 1
  ... 
}

### Creating an Index
 - Automatically when creating a PUT 
 `curl -d '{"address":"123place", "floors":10, "offices":21, "loc":{"lat":40.8, "lon": -74.2}}' -X PUT localhost:9200/business/building/110`
 