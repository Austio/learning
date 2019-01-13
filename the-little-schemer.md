### [The Little Schemer](https://repl.it/@AustinStory/LittleSchemer)

### Commandments
 1. Always ask `null?` as the first question in expressing any function
 2. Use `cons` to build lists
 3. When building a list, describe first typical element then cons it into the natural recursion
 4. Always change at least 1 arg when recurring that is closer to termination.  When using cdr test termination with #1
 
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
  - typical element - the item when constructing a list that fulfils the definition of what we are looking for  
  - natural recursion - natural recurring of function, normally `fun (cdr lat)`
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

#### Define rember

```
// rember atom list : removes the first atom from list

// failed attempt 1

(define rember
  (lambda(a lat)
  (
    (cond
      ((null? lat) ())
      ((eq? (car lat) a) (cdr lat))
      (else (cons () (rember a (cdr lat)))))))

// success 2
(define rember
  (lambda(a lat)
    (cond
      ((null? lat) (quote ()))
      (else (cond 
        ((eq? (car lat) a) (cdr lat))
        (else (cons (car lat) (rember a (cdr lat)))))))))

(define multiarr (cons (car arr) arr))

// Book final answer
(define rember
  (lambda(a lat)
    (cond
      ((null? lat) (quote ()))
      ((eq? (car lat) a) (cdr lat))
      (else (cons (car lat) (rember a (cdr lat)))))))
(rember "steak" multiarr) #("steak" "lobster" "biscuits")      
// Remove all occurrences
(define multirember
  (lambda(a lat)
    (cond
      ((null? lat) ())
      ((eq? (car lat) a) (multirember a (cdr lat)))
      (else (cons (car lat) (multirember a (cdr lat)))))))
(multirember "steak" multiarr) #("lobster" "biscuits")


```

#### Define firsts
```
firsts ((lobsters stuff) (steak things) (1 2 3)) => (lobster steak 1)

(define firsts 
  (lambda (lat)
    (cond 
      ((null? lat) ())
      (else 
        (cons 
          (car (car lat)) 
          (firsts (cdr lat)))))))
```


#### Using cons
```
insert to the left/right of first occurance of atom

(define arr '("steak" "eggs" "lobster"))
(insertR "tasty" "steak" arr) => ("steak" "tasty" "eggs" "lobster")

(define insertR
  (lambda (new old lat)
    (cond
      ((null? lat) ())
      ((eq? (car lat) old) 
        (cons old (cons new (cdr lat))))
      (else 
        (cons (car lat) (insertR new old (cdr lat))))  
    )))

(insertL "tasty" "steak" arr) => ("steak" "tasty" "eggs" "lobster")
(define insertL
  (lambda (new old lat)
    (cond
      ((null? lat) ())
      ((eq? (car lat) old) 
        (cons new (cons old (cdr lat))))
      (else 
        (cons (car lat) (insertR new old (cdr lat))))  
    )))
    
(define subst
  (lambda (str lat)
    (cond
      ((null? lat) ())
      ((eq? str (car lat)) (cdr lat))
      (else (cons (car lat) (cdr lat)))
    )))
(subst "steak" arr)
    

(define subst2
  (lambda (old1 old2 new lat)
    (cond
      ((null? lat) ())
      ((or 
          (eq? old1 (car lat))
          (eq? old2 (car lat))) 
        (cons new (cdr lat)))
      (else 
        (cons (car lat) (subst2 old1 old2 new (cdr lat))))
    )))

(subst2 "bear" "lobster" "shark" arr)

(define multiInsertR
  (lambda (new old lat)
    (cond 
      ((null? lat) ())
      ((eq? old (car lat)) 
        (cons old (cons new (multiInsertR new old (cdr lat)))))
      (else (cons (car lat) (multiInsertR new old (cdr lat))))  
    )))

(multiInsertR "tasty" "steak" multiarr) (steak tasty steak tasty lobster biscuits)

(define multisubst
  (lambda (new old lat)
    (cond
      ((null? lat) ())
      ((eq? old (car lat)) (cons new (multisubst new old (cdr lat))))
      (else (cons (car lat) (multisubst new old (cdr lat))))
    )))

(multisubst "bear" "steak" multiarr) # (bear bear lobster biscuits)
```