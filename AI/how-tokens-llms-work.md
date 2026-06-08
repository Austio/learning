# [What are Tokens in AI](https://bearisland.dev/posts/tokens-and-tokenization/)

The Straberry failure, where an untrained llm will answer 2 for the number of r's, is a clean demonstration of the architectural limitations of a guessing llm.  It is against the architecture because the model only sees tokens of it's vocabulary.  The model is blind to letters, it never sees them.    

## Tokens

At a high level, they smallest atomic unit that an LLM can percieve.  A series of integers. 

Interestingly, tokens in LLMs are similar to tokens in Elasticsearch when it goes through the three steps to normalize the input before doing lookups.  

Only they are converted into tokens.  Each LLM has a finite set of tokens that are determined when the model is trained.  Each LLMs will be different.  As a good example

This is the reason several LLMs will confidently say strawberry has 2 rs.  When the word is tokenized, the rs can be truncated because they are not important.

### TOKENizing Examples

I love Strawberry milkshakes! tokens to the following, where a * signals a leading white space
GPT 4 - "I" "*Love" "*Str" "aw" "berry" "*milk" "*sh" "akes" "!" - 9 tokens
Llama 3 - "I" "*love" "*straw" "berry" "*milk" "shakes" "!" - 7 tokensHello! How many r's are in strawberry?

### BPE Algorithm

This decides, given a corpus, which subword chunks deserve to be tokens.  To do this you grab a corpus and a target vocabulary (normally 30k to 100k) then you end  up with a list of tokens.  Nothing is ever out of the vocabulary.  For a set curpus
1. Initialize vocab with every distinct character of the corpus
2. Scan and count every adjacent pair of tokens
3. Take the most frequent pair, merge it into a new token and add it to the vocab
4. Repeat 2/3 until vocab has V entries

Generally - Common words and commons sequences are compressed into single tokens

### Byte Level BPE

Characters = Lossy - Byte Level = Preserved

The above is great on characters for english, but it won't help for emojis, chinese or unicode.  

GPT 2 started to break into the 256 possible bytes

This is great because out of vocabulary is elminated by constructions, the worst case is it will fall back to bytes.

### Vocabulary size as design

Why stop at 30 or 256k tokens?  Why not millions?

Cost is V * D^2 - which is the hidden dimensions 

#### Vocab Size Impact on Cost
 
Bigger v = More common substrings have their own token, documents encode to fewer tokens
 - Less work per document
 - More content per budget
 - Lower compute costs

##### Cost 1 - Embedding Matrices
- every token needs it own row in the [embedding matrix](https://bearisland.dev/posts/pretraining-overview/#tokens-become-embeddings)
- so - vocab tables cost 2 * V * d

With D = 4096

|V|	model|	vocab parameters|
|---|---|---|
|32,000	|LLaMA 2	262 M|
|128,000|	LLaMA 3	1.05 B|
|256,000	|Gemini	2.10 B|
|1,000,000|	hypothetical|	8.19 B|

- Every Parameter Spent on V is a parameter you cannot spend on reasoning capacity
- benefits shrink with each new token - costs grow linerarly 

compression gain sales roughly with log V - you pay linear cost for vanishing additional gain

| v      |	tokens per word	| comment                                   |
|--------|---|-------------------------------------------|
| 1,000  |≈ 5| 	essentially character-level              |
| 30,000 |≈ 1.3	| common words are one token                |
|100,000|≈ 1.15	| most words and common phrases consolidate |
|1,000,000|≈ 1.05	|tiny extra gain, huge extra cost|

##### Cost 2 - Rare tokens barely get trained

Token rows in the embedding matrix only get trained on the times they appear in the data.  Giving rare or once concepts tokens will have very little benefit.  

Zipf's law - th ekth most common token appears proportional to the 1/k as often as the most common
 - top 1000 tokens, cover roughly 80% of all text
 - top 10k cover 95%
 - everthing else it long tail

On typical 1 trillion token training corpus
 - v = 32k - even the rarest token sees tens of thousands of updates (embeddings coverage)
 - v = 1m - hundreds of thousands of long tial tokens see only 10 to a few hundred updates, they stay close to their random initialization

##### Cost 3 - each prediction gets expensive

Every time the model predicts the next token - it has to run a calculation throughout the matrix.  When the matrix is large due to large vocab size, that is expensive.

##### Putting Together

Small v (below 30k) - extra parameters yield big compression gains: spend more
Large v (above 256k) - spending huge extra parameters yields almost nothing, stop

Most modern range in 32-256
 - llama1 - 32k, heavily english
 - gpt 4 - 100k
 - llama3 - 128k - multi lingual
 - gemeini - 256k - minultilingual

The dominant pressure pushing V up is multilingual coverage

### Variants: BPE, word and sentence piece
 - BPE - covered above, merge most common adjacent pairs
 - WordPiece - googles variant, similar to BPT but scores based on corpus impact
 - SentencePice - skips pre tokenization entirely

