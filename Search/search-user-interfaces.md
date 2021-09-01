### [Search User Interfaces](https://searchuserinterfaces.com/book/sui_ch1_design.html)

### Chapter 1

##### Criteria For Evaluation
- Learnability: Ease of use on first interaction
- Efficiency: User speed to accomplish tasks AFTER learning interface
- Memorability: After long period of reuse
- Errors: How many errors (severity) and how hard to recover from
- Satisfaction: How pleasant

##### Guidelines for Search Interface
Offer Efficient, Informative Feedback.
- Status of system and how it relates to users interaction in system
- Think hourglass on operating system
- RE: Query Formulation, reasons results retrieved and next steps

Some specific
- Show results immediately 
- Highlight Results
- Allow sorting based on criteria
- Show query term suggestions
  - After user issued query, suggest refinements
  - Spelling Correction Suggestions
  - Suggestions of related or alternative queries (phrase term expansion)
    - Dogpile has 8.4% of queries from reformulation assistant
  - Replace with the related term then on enter or click actually search  
  - Don't rely on NOT and removing items, users will not understand
- Avoid Relevance Indicators for score, but reviews and stars are ok
- Support RAPID search.  Goal should be about 100ms

### Balance User control with Automated Actions
- Query Transformations: 
  - auto convert vs. to verson in MS Search
  - stopwords (removing a an, the) Search "to be or not to be"
  - stemming (morphological analysis) "organize organizes organizing"
  
### Reduce short-term memory load.
- Keep "words" in the search bar ("Search Here") to suggest action
- Support simple history
  - 40% of people search clicks were on a previous result
  - 71% got there using an identical query string as before
  - 17% of interviewees could "not get back to a page once visited"
  - Allowing search over recently viewed information can improve productivity
- Allow faceted navigation (grouping docs together in categories and allowing them to select.  Like Amazon)  

### Provide shortcuts for skilled users.
- Showing Rental form when someone searches "Rentals Seattle"

### Reduce errors; offer simple error handling.
- Avoid Empty Results Set
  - Faceted interface with query previews helps, 0 number they know to relax
- Address Vocubulary Problem
  - There are a huge variety of ways to express the same idea in english
  - 48 typists and 337 college students were asked to describe some items
    - .11 of typists/.12 of college students would name an object with same word
    - .22 typists/.28 students would use same name for common objects
    - .49/.48 had probability of having same 3 most common words
    - with 15 aliases per term, only 60-80% of original terms would be a match
  - This huge variety in expression has deep impact, we need to use `Term Expansion`
  - Use `Card Sorting` to properly label categories

### Recognize importance of small details
- Wider search bars encourage longer search phrases
- Varying order of document surrogate info dramatically effected how much learned
- First few results considered more relevant
- Google moved did you mean suggestion from top to Inline with results, at bottom of results and shortened to `Did you mean`

### Recognize importance of aesthetic in desig
- Task time for worst layout is twice for best layout
- Ads should also be relevant to search
