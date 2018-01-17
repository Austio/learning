### Variables

 - No unused variables
 - Default values are 0, false or empty
 - Strongly Types

```
var a int 32
a = 15

# Allocates 32 bytes of memory, probably 4 8 byte hex memory spots in ram for a, then adds value to it

0x0000000064
0x0000000065
0x0000000066
0x0000000067 | 15
``` 

```
// var declaration and assignment
var a int32
var a int32 = 15

// infered type
var a = 15 
a := 15
```

### Expressions

Returns a value by applying functions/operators to operands

### Control Structures

#### For
```
# For statement anatomy
for <init-Optional>; <expression>; <post-Optional> {
    <codeblock>
    <breakStatement-Optional>
}

i := 10

for i > 0 {
	fmt.Println(i)
	i = i - 1
}

for i:=10; i>0; i-- {
    fmt.Println(i)
}
```

#### If
```
if <boolean> {
    <code block>
} else if <boolean> {

} else {

}
```

#### Switch
```
switch <expression> {
    case <expression>:
    <code>
    fallthrough (optional, means keep going)
    case <expression>:
      <code>
    default: 
      <code>  
}
```
### Functions
  
```
func name(val type) return_type {
    <code>
}
```

 - pass by value by using the stack
 - function calls cause the value of what is passed in to be copied onto the stack, and that value is passed in
 

```
# Example of pass by value and stack usage
package main

import "fmt"

func reset_value(i int) {
    fmt.Println("reset_value i:", i, "Location:", &i)
    i = 0
    fmt.Println("reset_value i:", i, "Location:", &i)
}

func main() {
    j := 15
    fmt.Println("main j:", j, "Location:", &j)
    reset_value(j)
    fmt.Println("main j:", j, "Location:", &j)
}
```

#### Pointers and Dereferencing
 - & -> the memory access for a variable
 - * -> the value of the memory reference 

 ```
func maxMutateExample(a, b int, ref *string) int {
	if a > b {
		*ref = "a is highest"
		return a
	}

	*ref = "b is highest"
	return b
}

func main() {
	a := 1
	b := 2
	high := "?"

	fmt.Println("Before", high)
	fmt.Println("Calling Function: Highest is", maxMutateExample(a, b, &high))
	fmt.Println("After ", high)
}
```

### Scope

Go is lexically block scoped

 - Package level, it is accessible everywhere
 - Go only errors on unused variables inside of functions
 - Implicit operator only usable in functions (:=)
 - Functions can only use variables after the point they are declared 
 - golang.org/ref/spec#Declarations_and_scope
 - golang-books.com/books/web/01-02

```
# If we remove this global outer, the check() would error on the first fmt
var a = "outer"

func check() {
	fmt.Println(&a, a)
	a := "inner"
	fmt.Println(&a, a)
}

func main() {
	fmt.Println(&a, a)
	check()
}

0x1139150 outer
0x1139150 outer
0xc42000e1f0 inner
```  

### Arrays and Slices

```
var name[size]datatype
var a[5]int

# Shorthand
a := [5]int {0,1,2,3,4}

```

 - In go arrays are list of elements of same type and set length

#### Slices

- Is a segment of an array, does not exist on it's own 
- A window of an array (contiguous)
- Can't be bigger than the array
- Two slices can overlap and erference the same array a[1:4] & a[2:3]
- Stored as pointers (memory location, data type and length)

* WHY *
- Can manage arrays for us and manage them in the background 
- Allow you to pass arrays (easily) by reference 

```
array[low:high]
array[:high] # low is 0, 
a[0:5] and a[0:] equivalent
array[low:] # high is len of array
a[:] # low 0 high len of array
a := [5]int {0,1,2,3,4}
a[1:3] => [1,2]
```

##### make and append

```
make([]datatype, length, capacity)

#
a := [5]int {0,1,2,3,4}
x := a[1:3]
# length is 2
# capacity is 4, capacity taken from remaining size of the pointer referenced array

x[0] => 1

append(x, 5)

cap()
len()
```

### Simple Statements

- goo.gl/8HLO75
- goo.gl/Vhpujb

#### Extending If

- Are block scoped along with the construct that is used with

```
if <simple statement>; <boolean> {
    <codeblock>
}

# the err is block scopes to the if condition
if err := file.Chmod(0664); err != nil {
    <codeblock>
}
```

### Range 
- looping over slice, forEach ish like concept
- Index and elm are mandatory for capturing returns

```
for index, elm := range slice {

}
```

### Variadic Functions
- ...
- Allow you to set the arity of a function to be 0..many of something
- The parameter for the variadic function is a slice 
```
func max(numbers ...int) int {

}
```
