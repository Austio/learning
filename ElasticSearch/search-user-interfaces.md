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
  


- Provide shortcuts for skilled users.
- Reduce errors; offer simple error handling.
- Strive for consistency.
- Permit easy reversal of actions.
- Design for closure.