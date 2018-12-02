[Original Paper to PDF](./references/how-google-code-search-worked.pdf)

### How Google Code Search Worked (Regular Expression Matching with a Trigram Index)

- Searched all open source projects by regex

Constraints
- There are too many open source project to keep all In memory, so will need to load from disk
- Use existing google document architecture (inverted index)

#### Solution
Build index of n-grams (substrings of length n) with n of three
Convert regular expression search to something that can search the ngrams

Using trigrams the following documents would index as follows

```
(1) Google Code Search
(2) Google Code Project Hosting
(3) Google Web Search
has this trigram index:

_ => denotes a space

_Co: {1, 2}     Sea: {1, 3}     e_W: {3}        ogl: {1, 2, 3}
_Ho: {2}        Web: {3}        ear: {1, 3}     oje: {2}
_Pr: {2}        arc: {1, 3}     eb_: {3}        oog: {1, 2, 3}
_Se: {1, 3}     b_S: {3}        ect: {2}        ost: {2}
_We: {3}        ct_: {2}        gle: {1, 2, 3}  rch: {1, 3}
Cod: {1, 2}     de_: {1, 2}     ing: {2}        roj: {2}
Goo: {1, 2, 3}  e_C: {1, 2}     jec: {2}        sti: {2}
Hos: {2}        e_P: {2}        le_: {1, 2, 3}  t_H: {2}
Pro: {2}        e_S: {1}        ode: {1, 1}     tin: {2}
```

Convert the regexp into something that can search out trigrams.

```
/Google.*Search/
Goo AND oog AND ogl AND gle AND Sea AND ear AND arc AND rch
```

Once the candidate documents are identified we can really search them once loaded in order to find the regex.