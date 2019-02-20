### [The Little Schemer](https://repl.it/@AustinStory/LittleSchemer)

### Commandments
 1. Always ask `null?` as the first question in expressing any function for `lat` and `zero?` for numbers.
  - When recurring on a list of s-expressions, ask if it is null?, atom or else
 2. Use `cons` to build lists
 3. When building a list, describe first typical element then cons it into the natural recursion
 4. Always change at least 1 arg when recurring that is closer to termination.  Use `cdr` for `lat` and `sub1` for `numbers`
  - When recurring on list of s-expressions, l, user car/cdr if either null? or atom(car l) are true
 5. Additions terminates with 0 (+ n 0), multiplication with 1 (x n 1) and cons with () (cons list ())
 6. Simplify only after the function is correct
 7. Recur on subparts that are of the same nature (sublists of a list, subexpressions of an arithmetic expression)
 8. Use helper functions to abstract from representation
 9. Abstract common patters with new functions
 10. Build functions to collect more than 1 value at a time
 
### Definitions
  - atom is a string/number 
  - list is collection of 0 or more S-Expressions enclosed by ()
    - null list is an empty list ()
    - (null? ()) is true
  - tuple (tup) list of numbers or an empty list 
  - S-Expression atoms, lists
  - arithmetic expression is an atom or two arithmetic expressions combined by (+, x or up)
  - pair a list of exactly 2 s-expressions (1 2) (() (1, 2)) (foo (bar))
  - rel a list of pairs with unique first values
  - fun is a function
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
  - `lat?` takes a list, true if all s-expressiosn are atoms
  - `rember` remove a member
  - `col` collector, used to aggregate s-expressions into lists
  - typical element - the item when constructing a list that fulfils the definition of what we are looking for  
  - natural recursion - natural recurring of function, normally `fun (cdr lat)`
  - func* - convention for a function that will recur into a list
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

### Fun with numbers
```
(define add1 (lambda (atom) (+ atom 1)))
(add1 50)
(define sub1 (lambda (atom) (- atom 1)))
(sub1 49)
(define zero? (lambda (atom) (eq? 0 atom)))
(zero? 1)

#TODO Revisit this PG 61
(define - 
  (lambda (a b)
    (cond
      ((zero? b) (a))
      (else (sub1 (- a (sub1 b))))))
      

(define tuple `(1 2 3 4 5))
(define addtuple
  (lambda (t)
    (cond
    ((null? t) 0)
    (else (+ (car t) (addtuple(cdr t)))))))
(addtuple tuple)      

(define x
  (lambda (m n)
    (cond
      ((zero? n) 0)
      (else (+ m (x m (sub1 n)))))))
(x 13 15)

# adds 2 tuples (1 2) (3 4) => (4 6) and (1 2) (1) => (2 2)
(define tup+
  (lambda (t1 t2)
    (cond
      ((null? t1) t2)
      ((null? t2) t1)
      (else 
        (cons 
          (+ (car t1) (car t2))
          (tup+ (cdr t1)(cdr t2)))))))
(tup+ tuple tuple)

# here order matters, if we check n first it fails for a same m/n like (> 7 7)
(define >
  (lambda (m n)
    (cond
      ((zero? m) #f)
      ((zero? n) #t)
      (else (> (sub1 m) (sub1 n))))))
(> 100 50)

(define < 
  (lambda (m n) 
  (cond
    ((zero? n) #f)
    ((zero? m) #t)
    (else (< (sub1 m) (sub1 n))))))
(< 100 100)


(define = 
  (lambda (m n)
  (cond
    ((and (zero? m) (zero? n)) #t)
    ((or (zero? m) (zero? n)) #f)
    (else (= (sub1 m) (sub1 n))))))
    (= 0 1)
    
# Book definition

(define = 
  (lambda (m n)
  (cond
    ((> m n) #f)
    ((< m n) #f)
    (else #t)    
    (= 0 1)
    
# up is to the power of    

(define up
  (lambda (m n)
  (cond
    ((zero? n) 1)
    (else (x m (up m (sub1 n)))))))
(up 10 3)

(define length
  (lambda (lat)
  (cond
    ((null? lat) 0)
    (else (add1 (length (cdr lat)))))))
(length arr)

(define pick
  (lambda (n lat)
  (cond 
    ((zero? n) (car lat))
    (else (pick (sub1 n) (cdr lat))))))
(pick 2 arr)

(define mixed-array `(1 bar 3 baz))
(define no-nums
  (lambda (lat) 
  (cond 
    ((null? lat) ())
    ((number? (car lat)) (no-nums (cdr lat)))
    (else (cons (car lat) (no-nums (cdr lat)))))))
(no-nums mixed-array)

# Type independent equal
(define eqan? 
  (lambda (a b)
    (cond
      ((and (number? a)(number? b)) (= a b))
      ((or (number? a)(number? b)) #f)
      (else (eq? a b)))))
      (eqan? `foo `foo)
      
# Remove occurences of atom      
(define occur
  (lambda (a lat)
  (cond 
    ((null? lat) ())
    ((eqan? a (car lat)) (occur a (cdr lat)))
    (else (cons (car lat) (occur a (cdr lat)))))))
(occur 1 mixed-array)   

(define one? (lambda (n) (eqan? n 1)))
(one? `f)

(define rempick-one
  (lambda (n lat)
    (cond 
      ((one? n) (cons (car lat) (cdr (cdr lat))))
      (else 
        (cons (car lat) 
              (rempick-one (sub1 n) (cdr lat)))))))
(rempick-one 2 mixed-array)    


(define llists (cons `lobster lists))
(define rember*
  (lambda (a lat)
    (cond
      ((null? lat) ())
      ((atom? (car lat))
        (cond
          ((eq? (car lat) a) (rember* a (cdr lat)))
          (else (cons (car lat)(rember* a (cdr lat))))))
      (else (cons (rember* a (car lat) (rember* a (cdr lat)))))    
      )))

(rember `lobster llists)

llists
# Goes through all lists and insertR
(define insertR*
  (lambda (new old l)
    (cond 
      ((null? l) l)
      ((atom? (car l))
        (cond
          ((eq? old (car l)) 
            (cons old (cons new (insertR* new old (cdr l)))))
          (else (cons (car l)(insertR* new old (cdr l))))))
      (else (cons
        (insertR* new old (car l))
        (insertR* new old (cdr l))
      )))))
(insertR* `bis `lobster llists)      

(define occur*
  (lambda (a l)
    (cond 
      ((null? l) 0)
      ((atom? (car l))
        (cond
          ((eq? a (car l)) (add1 (occur* a (cdr l))))
          (else (occur* a (cdr l)))))
      (else (
        + (occur* a (car l)) (occur* a (cdr l))
      )))))
(occur* `lobster llists) 

 # TODO Revisit
(define subst*
  (lambda (new old l)
    (cond
      ((null? l) ())
      ((atom? (car l))
        (cond
          ((eq? (car l) old) 
            (cons new (subst* new old (cdr l))))
          (else (cons (car l) (subst* new old (cdr l))))))
      (else cons (subst* new old (car l))
        (subst* new old (cdr l))))))
(subst* `lob `lobster llists)         


(define leftmost
  (lambda (l)
    (cond 
      ((atom? (car l)) (car l))
      (else (leftmost (car l))))))
(leftmost llists)

(define eqlist?
  (lambda (a, b) 
  (cond (
    ((and (null? a) (null? b)) #t)
    ((and (atom? (car a)) (atom? (car b)))
      (and (eq? (car a) (car b)) (eqlist? (cdr a) (cdr b))))
    ((and (list? (car a)) (list? (car b)))
      (and (eqlist? (car a) (car b)) (eqlist? (cdr a) (cdr b))))
    (else #f)
  ))))
(eqlist `foo `foo)


# for an s expression
(define equal?
  (lambda (s1 s2)
    (cond
      (and (null? s1) (null? s2) #t)
      ((and (atom? s1)(atom? s2)) 
        (eq? s1 s2))
      ((and (atom? s1)(atom? s2)) #f)
      (else (and 
        (equal? (car s1)(car s2))
        (equal? (cdr s1)(cdr s2)))
    ))))
        
```

### CH 6. Shadows

Create a value function for this ds
 - underscores wrap expressions for specificity _ 1 + 2
 - we support +, -, x and ^
 - specificity is left most first
 
```
TODO this would be fun to revisit
(define plus `+)
(define left_quote `l)
(define right_quote `r)

(define value
  (lambda (aexp)
    (cond
      (and (atom? aexp) (number? aexp) aexp)
      ((eq? (car (cdr aexp)) plus) 
        (+ (value (car aexp)) (value (car (cdr (cdr aexp))))))
      (and (atom? (car aexp)) (number? (car aexp)) (car aexp))
    )))

(define aexp `(1 + 5))
``` 

### CH 7. Friends and Relations

```
(define countVals
  (lambda (val lat) 
    (cond
      ((null? lat) 0)
      ((eq? (car lat) val) (add1 (countVals val (cdr lat))))
      (else (countVals val (cdr lat))))))

(define set?
  (lambda (lat)
    (cond
      ((null? lat) #t)
      ((eq? 0 (countVals (car lat) (cdr lat))) (set? (cdr lat)))
      (else #f))))
(set? `(1 2 3 3))        


(define fruit `(apple peach pear peach plum apple lemon peach))              

(define makeset
  (lambda (lat)
    (cond
      ((null? lat) ())
      (else (cons (car lat) (rember (car lat) (cdr lat)))))))

(makeset fruit)

(define subset?
  (lambda (s1 s2)
    (cond 
      ((null? s1) #t)
      (else 
        (and 
          (member? (car s1) s2)
          (subset? (cdr s1) s2))))))

(subset? `(apple plum) frui)


(define remberone
  (lambda (a lat)
    (cond 
      ((null? lat) lat)
      ((eq? a (car lat)) (cdr lat))
      (else (cons (car lat) (remberone a (cdr lat)))))))

(define eqset? 
  (lambda (s1 s2)
    (cond 
      ((and (null? s1) (null? s2)) #t)
      ((or (null? s1) (null? s2)) #f)
      (else 
        (and
          (member? (car s1) s2)
          (eqset? (cdr s1) (rember (car s1) s2)))))))

(eqset? `(plum apple plum) `(plum plum apple))

(define intersect?
  (lambda (s1 s2)
    (cond
      ((null? s1) #f)
      (else 
        (or (member? (car s1) s2)
            (intersect? (cdr s1) s2))))))

(define intersect?
  (lambda (s1 s2)
    (cond
      ((null? s1) #f)
      ((member? (car s1) s2))
      ((intersect? (cdr s1) s2)))))
      
(intersect? `(peach pear plum) `(plum plum apple))

(define intersect
  (lambda (s1 s2)
    (cond
      ((null? s1) ())
      ((member? (car s1) s2) 
        (cons (car s1) (intersect (cdr s1) s2)))
      ((intersect (cdr s1) s2)))))

(intersect `(peach pear plum) `(plum plum apple))

(define union
  (lambda (s1 s2)
    (cond
      ((null? s1) s2)
      ((member? (car s1) s2) 
        (union (cdr s1) s2))
      (else
        (cons (car s1) (union (cdr s1) s2))))))

(union `(peach pear plum) `(plum plum apple))

(define difference
  (lambda (s1 s2)
    (cond 
      ((null? s1) ())
      ((member (car s1) s2) 
        (difference (cdr s1) s2))
      (else (cons (car s1) (difference (cdr s1) s2))))))

(difference `(peach pear plum) `(plum plum apple))

(define intersectall
  (lambda (set) 
    (cond
      ((null? (cdr set)) (car set))
      (else 
        (intersect 
          (car set) 
          (intersectall (cdr set)))))))

(intersectall `((peach pear plum) (plum plum apple pear) (pear plum)))

(define a-pair? 
  (lambda (pair)
    (and (list? pair) (eq? 2 (length pair)))))
(a-pair? `(1 2))

(define pairs `((1 2)(3 4)))

(define revrel
  (lambda (pairs)
    (cond
      ((null? pairs) ())
      (else 
        (cons 
          (cons (car(cdr(car pairs)))(car(car pairs)))
          (revrel(cdr pairs)))))))

(revrel pairs)
```

### CH8. Lambda the Ultimate

Functions with currying and partial application

```
(define rember-f
  (lambda (test?)
    (lambda (a lat)
      (cond
        ((null? lat) ())
        ((test? (car lat) a) (cdr lat))
        (else (cons (car lat)
          ((rember-f test? a (cdr lat)))))))))

(define rember-eq? (rember-f eq?))
(rember-eq? steak multiarr)


(define insertL-f
  (lambda (test?)
    (lambda (insert pivot l)
      (cond
        ((null? l) ())
        ((test? pivot (car l)) (cons insert (cons pivot l)))
        (else (cons (car a)
          ((insertL-f test?) insert pivot (cdr l))))))))
(define insertLF (insertL-f eq?))
(insertLF `icecream steak multiarr)

(define insertR-f
  (lambda (test?)
    (lambda (insert pivot l)
      (cond
        ((null? l) ())
        ((test? pivot (car l)) (cons pivot (cons insert l)))
        (else (cons (car a)
          ((insertR-f test?) insert pivot (cdr l))))))))
(define insertRF (insertR-f eq?))
(insertRF `icecream steak multiarr)

;dynamically add either to the left or right
(define insertG-f
  (lambda (l_or_r)
    (cond
      ((eq? `l l_or_r) insertL-f)
      (else insertR-f))))

(define insertRGF ((insertG-f `r) eq?))
(insertRGF `icecream steak multiarr)

(define putleft 
  (lambda (insert pivot l)
    (cons insert (cons pivot l))))

(define putright 
  (lambda (insert pivot l)
    (cons pivot (cons insert l))))

(define insertGSeq-f
  (lambda (test? sequence)
    (lambda (insert pivot l)
      (cond
        ((null? l) ())
        ((test? pivot (car l)) (sequence insert pivot l))
        (else (cons (car a)
          ((insertR-f test?) insert pivot (cdr l))))))))
(define insertLFSeq (insertGSeq-f eq? putleft))
(insertLFSeq `icecream steak multiarr)

(define insertRFSeq (insertGSeq-f eq? putright))
(insertRFSeq `icecream steak multiarr)

(define atom-to-function
  (lambda (a)
    (cond 
      ((eq? a quote(x)) x)
      ((eq? a quote(+)) +)
      (else up))))

(define value 
  (lambda (nexp) 
    (cond
      ((atom? nexp) nexp)
      (else 
        ((atom-to-function (operator nexp)) 
          (value (first-sub-exp nexp))
          (value (second-sub-exp nexp))))))

```


#### REPL.IT Export
