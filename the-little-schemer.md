### [The Little Schemer](https://repl.it/@AustinStory/LittleSchemer)

CH1
  - atom is a string that does not begin with ()
  - list is collection of 0 or more S-Expressions enclosed by ()
    - null list is an empty list ()
    - (null? ()) is true
  - S-Expression atoms, lists
  - `car` - first s-expression of a non empty list
    - takes non empty list
    - (car l) ~ the car of list l
  - `cdr` (could-er) - list without car of a non empty list
    - (cld l) ~ the cld of list l 
    - (cld (l)) => () 
  - `cons` adds s-expression to front of list
    - takes an s-expression and any list
    - (define l (quote (butter and jelly))) 
    - (define a (quote peanut))
    - (cons a l)
    - => (peanut butter and jelly)
  - (quote ()) => empty list  
  - `null?` can only be asked of lists and is true for ()
  - `atom?` takes s-expression and returns true for atom
  - `eq?`
    - takes two non-numeric atoms
    - atoms: (eq? (quote henry) (quote henry)) => #t
    - atoms: (eq? (quote henry) (quote hudson)) => #f

```
(define atom?
  (lambda (x)
    (and (not (pair? x)) (not (null? x)))))

(atom? quote())

// cons
(define l (quote (butter and jelly)))
(define a (quote peanut))
(cons a l)
// (peanut butter and jelly)
```