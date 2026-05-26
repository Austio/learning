https://karpathy.github.io/2026/02/12/microgpt/

[Gradiants](https://www.youtube.com/watch?v=VMj-3S1tku0)
 - at 8:11 - 14:142

 - https://colab.research.google.com/drive/135jwZdiRKc0V5JMx_GuyWtwWA0aF-ELo

GPT Has a few components


|Component|What it does|Example|
|DataSet|...|jim,john,bill,etc|
|Tokenizer|Splits a Dataset into arbitrary unique tokens|j,i,m,o,h,n,b,l|
|BOS|Signifies the beginning of a sequence when tokenizing|[BOS,j,i,m,BOS]|
|AutoGrad|Parses the tokens into value objects and calculates their gradients|Value objects, see below|
|Gradiants|A value representing how the calculation impacts the result||

 - 
