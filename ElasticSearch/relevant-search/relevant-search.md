## [Relevant Search](https://www.manning.com/books/relevant-search)

[Good Seed Data](https://www.elastic.co/guide/en/kibana/current/tutorial-load-dataset.html)

### Chapter 1 - What is relevancy

Definition: The Practice of improving search results `for users` by satisfying the `information needs` in the context of a particular `user experience` while balancing how raking `impacts business needs`.

When thinking about relevancy, consider these perspectives
 - What is content (tweets, beanie babies, news)
 - What sort of user (TechSavvy, professionals, shoppers)
 - What type of search (Japanese, Filled with Jargon, People)
 - What do users expect (Library and Catalog, shopping experience)
 - What does employer hope to get out of this
 - What are the valuable features of our content
 - What are the valuable signals that things are going well with search
 
To get full relevance you must identify valuable features of content and use those to computer relevance signals all within the context of feedback.

### Chapter 2 - Search Under the Hood

 

### Chapter 8 - Providing Relevant Feedback

#### 8.1 Relevant Feedback at search box

Providing information as users type can help them understand and refine their searches.  There are 3 ways
 - Search as you type
 - Search Completion
 - Postsearch Suggestions
 
##### Search as you type: Immediate Results
Goal to proactively provide matching documents in order to provide 
 - Relevance feedback:  As user sees results they can make search more broad or narrow to get qualified documents
 - Fast results: So that the user does not have to consciously submit a query before seeing result.  Users can choose to keep typing or select a resulting documnet 

One issue that can come up is the need to provide suggestions along side results.

This can cause some edges when both suggestion and results are sharing the same space
 - Confusing for users to discern between them
 - Confusing for users to know why a search surfaced
 - Hard to provide information about matching documents
 - Unless matching on 1 field (title) it is hard to provide feedback on why a search surfaced
 - Google eliminates this by only displaying search suggestions in query and surfacing results in result area

Search Suggestions Query 
```json 
{ "query": 
  { "match_phrase_prefix": 
    "title": "Star trek"
  }
}
``` 
 
##### Search Completion
Unsure Rich Results, Timely Completions and Suggestions with results
 

Goal to usher user to better search queries.  Users intuitively type, reformulate and occasionally select the result
 - Users expect fast feedback, without speed the user will continue without aid
 - Users expect search suggestions with results, clicking a suggestion with 0 results reduces trust
 
There are 3 methods to build search completions
 - Past User input
 - Y
 - Z

###### Past User Input: 
 - Uses the corpus of all previous searches to make recommendations on new searches
 - Consider if you are in a `short-tail` with hundreds of searches or `long-tail` with millions.  With too few queries you have insufficient data to build a satisfactory completion experience.  With too many you have to discern importance. 
 - Consider staleness factor, for instance consider how e-commerce with frequently changing content has to deal with rotating contnet
 - Ensure no 0 length results
 
###### Current Input:
 -  
 