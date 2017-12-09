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