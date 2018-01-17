# Why Go?

 - Created by google to be performant and scalable.  
 - Compiled, static types, created to take advantage of multiple cores.  
 - The people who made it were the same ones responsible for C, UTF8, Unix
 
 # Templates
 
  - naming -> `template.gohtml` ish
  - template.ParseFiles returns Pointer to a template -> Container holding all templates passed in
  - template.ParseFiles - template.ParseGlob
  - Parse files only once, can do in an init() func
  - template.Must does error checking for you, takes a *template and error which is what ParseGlob/ParseTemplate return
  