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