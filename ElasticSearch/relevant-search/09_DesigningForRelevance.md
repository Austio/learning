### Chapter 9 - Designing a Relevance Focused Search Application

 - Start => A problem that needs to be solved. ID and think through that problem.
 - Gather Information
 - Design Application
 - Maintain

#### Gather Information
- Identify questions that users will ask
  - Create Personas for each of your users. 
  - Imagine the queries and expectations of those personas.
    - Stuart the Specialty Referrer
    - Meg the Medical Student (resnav, etc)
  - Allows you to id typical us cases and information you need and the questions / needs of them
- Identify business needs
  - How will you sustain business
  - How will you get information for searching
  - How will you encourage information sharing to improve search
  - Great 'yowl' example: temporary boost for restaurants that update information, can pay to be boosted/featured
- Identify the required and available information
  - What information is required?
  - What will the information be used for?
  - How do you get it?
  - How will the information be used as part of searches (filter, boost, display, search, listing)
 
#### Visualize Users Experience

Relevance perspective: 
 - Primary: help users fulfill info needs as quickly as possible
 - Secondary: provide user with relevance feedback to help them adjust
 
How will the interface with the search: 
 - how will each persona use filters/search

#### Building fields/queries 
9.3.2 defining fields and signals, super great for which analyzers to use
 - location: (geo_point)
   - by bounded box and user current location
 - content: (text fields) name, menu, description, cuisine_hifi (restaurant owners), cuisine_lofi (users)
   - uses multi_match b/c user will probably search restaurant or cuisine or menu item
 - preference: price, rating, ux filters
 - business concerns: (align with business strategy) has_discount, promoted, engaged

9.6 puts this all together these are only the sub functions
``` 
// Business Concerns
// Filter is used to limit the number of businesses scored by script
//   it won't exclude any but only those that match will be scored withthe
//   computationaly expensive script_score
{   "query": {
        "function_score": {
            "functions": [{
                "filter": {
                    "bool": {
                        "should": [
                            { "term": { has_discount: True }},
                            { "term": { promoted: True }},
                            { "term": { engaged: True }}]}},
                "script_score" : {
                    "script": """
                        0.5*doc["promoted"].value +
                        0.3*doc["has_discount"].value +
                        0.2*doc["engaged"].value
                    """}}]}}}

// Preference, D represents a single dollar, S represents a star
{   "query": {
        "bool": {
            "filter": [
                {"match":{
                    price: "D"}},
                {"match":{
                    rating: "S"}}]}
                    

// Content
{  "query": {
     "multi_match": {
       "query": <user query>,
       "fields": [
         "name^10", "menu^2", "description^1", "cuisine_hifi^10", "cuisine_lofi^2"],
       "tie_breaker": 0.3 }}}
       // multi_match uses best_fields approach, add tie_breaker for some cases when they search by 2

// Location: Bounded Box Searching
{   "filter": {
        "geo_bounding_box": {
            "location": {
                "top_left": <northwest corner of user display>,
                "bottom_right": <southeast corner of user display>}}}}
                
// Content: Close to user
{   "query": {
        "function_score": {
            "functions": [{
                "gauss": {
                    "location": {
                        "origin": {
                            "lat": <user-lat>,
                            "lon": <user-lon>},
                        "offset": "0km",
                        "scale":  "10km"}}}]}}}                
```

##### How to tune relevance

After this is set and composed, you have to tune relevance, which is hard due to the number of contexts you are going to deal with.   To start
 - Get a set of popular queries
 - Understand what "good" looks like for each of those
 
Relevance Signals to Monitor
 - Time on Page
 - Click through rate
 - Conversion Rate
 - Retention
 - Deep Paging? (negative)
 - Pogo Sticking (bounce)
 - Thrashing or reformatting (change several searches in a row)
 - Zero Results Rate
 
Updating
 - Text Analysis - Protected words so that they are not in appropriately stemmed (french fries are not french cuisine)
 - Signal Modeling - Adding/removing/analyzing fields differently (description field not useful example)
 
Stopping when good enough
 - more perfect can actually make it brittle and resisstant to change
   
 