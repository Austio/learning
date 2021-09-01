### Chapter 11 - Semantic Personalized Search

Sophisticated search apps understand both content and users.  Which allows personalized search and recommendations.

- Personalized Search: Based on user tastes and knowledge about user / interactions
- Concept Search: ranks docs based on concepts (search domain, jargon)

##### Profile Based
 - Give incentives users to give more profile information
 - Let them tag their profiles with categories that interest them
 - Describe themselves in free text
 - Use Gender, age, income level, etc for boosting
 
For instance, if a user shows affinity towards a brand boost it a little
 - Don't overboost, ow you end up in a situation where they can't find anything else but that
 
#### User Behavior Based: Collaborative Filtering
 - historical information about user-item iteratctions (view, rating, purchase)
 - eg: users who purchase barbie dolls are likely interested in girls dresses
 
Some techniques for determining this
 - Practical Recommender Systems book recommendation 
 - some other optiosn: matrix decomposition, matrix based collaborative filtering, non-negative matrix factoization, alternating least squares
 - co-occurrence.  
   - take all purchases, group them by user
   - count the number of times that an item A is also purchased with item B (this is the co-occurrents).  
   - At the end, you have the items that co-occur along with number of times, the high co-occurence, the more associative
   - after that, when a user makes a purchase, you can do a summation on the purchased items for co-occurrents
   - then use that to recommend what the next thing they should look at should be
   
Usable through a function score.  Example with a summer dress

```
{  "query": {
        "function_score": {
            "query": {
                "multi_match": {
                    "query": "summer dress",
                    "fields": ["title^3", "description"]}},
            "functions": [{
                "filter": { COLLAB_FILTER },
                "weight": 1.1}]}}}
               
``` 
  
COLLAB_FILTER Can be calculated in several ways 

1. Query Time: Through storing high-affinity items in a data store, then can boost directly
```
COLLAB_FILTER = {
  "terms": {
    "id": ["item4816", "item3326", "item9432"]
  }
}
```

2. Index Time: Add a new field to document `users_who_might_like`
```
COLLAB_FILTER = {
  "term": {
    "users_who_might_like": "user121212"
  }
}
```

3. Index and Query Time: Store users most recent purchases and `related_items` to the index
```
COLLAB_FILTER = {
  "terms": {
    "related_items": ["item1234", "item9432"]
  }
}
```

#### 11.3 Concept Search
Takes good search of inferring users intent and providing documents that carry information they seek to the extreme.

 - Understand meaning of users query.  Search for things, not strings
 - Augments queries and documents to take advantage of new relevance signals to increase recall

Synonyms and Signals are complementary approaches.  
 - Document tagging, have users only apply the most specific tag then hierarchically strucutre synonyms can be automatically augmented on the documents with less specific tags

##### Signals

1. Easy implemention is adding a `phrase_tag` field so that content curators can tag articles with things like `heart_attack`
 - requires rigorous consistency and deep domain expertise
 - for example is acute heart attack different than heart attack

2. Crowd sourcing is another way to do this with end user tagging

3. Thrashing based search.  When a user searches for multiple things then lands on the document, can tag document with the thrashed terms
 - search for myocardial infarction, then cardiac arrest then heart attack and lands on page.  Those are probably related

##### Synonyms
Synonyms can be useful to increase recall when combining related terms
TV, T.V., television

And are also useful when combining hierarchy
marigold => yellow, bright_color
canary => yellow, bright_color
yellow => bright_color

TF*IDF works with us here because a term like marigold will most likely occur less often than yellow or bright_color so they will have a higher score

#### Machine Learning

Uses similar co-occurrence model as Collaborative filtering
 - Other options are latent semantic analysis, latent Direichlet allocation and Word2vec algorithm

#### Phrases

Before content augmentation, identify statistically significant phrases in the text and add them to the columns that are co-occuranced.
 - for example land developer and software developer
 - allows for suggestions of `phrases` which is better than words
 
Collocation Extraction is a common technique for identifying these.  Text of document is split into n-grams then counted for most occurences.

#### Search as recommendation engine

If we remove the search box and filters, we can still make recommendations to the users.

Recommendations are like a consultant.

Recommendations provide users with the best item available based on best information at hand.
 - User Information: Engagement, demographic
 - Item Information: Metadata/filtering
 - Recommendation context: Where is request coming from




