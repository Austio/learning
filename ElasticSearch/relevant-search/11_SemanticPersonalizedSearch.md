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
 - 
 
11.3.2
