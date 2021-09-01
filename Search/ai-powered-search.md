## [AI Powered Search](https://manning.com/book/ai-powered-search)

Definitiona
 - Vector: Collection of attributes for instance price, size and bedrooms of a house [100000,1400,3],[120000, 1500,4]
 - Dimensions: A specific set of vectors
 - Vector Space: Specific collection dimensions
   
 - Word Embeddings
   - add more context to vectors, for instance in an inverse index, apple joice would get matches for apple and juice.  However it would not match for drink or surgary drink. 
   - Word embeddings give us the ability to attach more context and "stength" to a match.  Instead of just apple and drink we can add N points for things that are related to it.
   - Once you have this, then you can do the dot product on the vectors for things to find out "similar" things are
   - really contextual search will pull out `Sentence Embeddings`, `Paragraph Embeddings`, `Page Embeddings`
    
For Modeling a DSL we have several things
 - Alternative Labels: identical meaning, replacement
   - Obvious acronyms, misspellings, alternatates
 - Synonyms: simliar, expansion, 
 - Taxonomy: classification into categories, parent child heirarchy
   - Creating a heirarchy.  Applied during search to only show some facets or drill down to a subset of results.  For instance showing ovens when someone searches "range" at home depot website
 - Ontology: Mapping of relationships between types of things (animal eats food, human is animal)
   - Thisis more about relationships, think neo4j, Person is Boss of Other, CMO is employee, etc
 - Knowledge Graph: Instance of ontology containing things that are related



