### Chapter 7 - Shaping the Relevance Function

- Signals: In this chapter take on more of a quantitative tone.  
  - How recent was an article published.
  - How close is the restaurant
  - Presence of these indicates when to filter or boost
   
- Ranking Function: Filtering and boosting directly adjust this.? TODO

##### Non Boost Score Shaping
 - Sort Criteria: base on date/popularity/computed value/distance
 - Negative Boosting: 
 - Rescoring/Reranking: Second stage ranking with tweaks to top
 - Scripting the Score: Completely take control of scoring with script
 
 
### How to Boost
Type of Boost: When boosting you have to decide if you want to add or multiply the boost to the results
 - additive: stacks the boost on top of base query.  Has to be just enough to make it a little better relative to the scores.  .1 may not be enough to matter, 100 will essentially override the base 
 - multiplicative: scales base query. 1.2 gives 20% more oomph over other queries
  
Method of Boost: 
1. boolean query: boost through boolean clause on top of the base query using `bool`
 - Must abstracted away.  
 - Always additive
 - You add a SHOULD on top and tweak with a few knobs to manipulate
2. function query: directly inline using `function_score`
 - direct control
 - multiplicative or additive
 
 
   
  
  

```
mostSearch = {
  "query": {
    "multi_match": {
      "query": "William Statner Patrick Stewart",
      "fields": ["title", "overview", "cast.name", "directors.name"],
      "type": "cross_fields"
    }
  }
}
```
