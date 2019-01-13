### [The Little Schemer](https://repl.it/@AustinStory/LittleSchemer)

### Commandments
 1. Always ask `null?` as the first question in expressing any function
 

### Definitions
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
  - `lat?`
    - takes a list, true if all s-expressiosn are atoms
  - `rember`
    - remove a member
      

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

#### Define lat

```
// create lat
(define lat?
  (lambda(l) (
    and
      (list? l) 
      (or 
        (null? l) 
        (and 
          (atom? (car l)) 
          (lat? (cdr l)))))))


(lat? (quote(a)) 
(lat? (cons (quote(a)) (quote(a b c))))
(lat? (quote a)) 

// Book defintion
(define lat?
  (lambda (l)
    (cond
      ((not (list? l)) #f)
      ((null? l) #t)
      ((atom? (car l)) (lat? (cdr l)))
      (else #f)
```

#### Define member?
```
(define member?
  (lambda (x y)
    (cond
      ((not (atom? x)) #f)
      ((not (list? y)) #f)
      ((null? y) #f)
      ((eq? x (car y)) #t)
      ((member? x (cdr y)))
      (else #f)
    )  
  )
)      

(define arr (cons "a" ()))
(member? "b" arr)

// Book defined
(define member?
  (lambda(a lat)
    (cond
      ((null? lat) #f)
      (else (or (eq? (car lat) a)
              (member? a (cdr lat)))))))
```