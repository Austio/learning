### Declarations - https://blog.golang.org/gos-declaration-syntax
 :=  - short variable declaration in functions, outside functiosn this is illegal
 x int - an integer named x
 p *int - a pointer to p
 a [3]int - array of 3 values

Functions follow this syntax
func name(arg* type) returntype*
 - func main(int, []string) int
 - f func(func(int,int) int, int) int
 - f func(func(int,int) int, int) func(int, int) int
 - sum := func(a, b int) int { return a+b } (3, 4)

When declaring function paramters, you can omit the type from consecutive similar types
 - x int, y int 
 - x, y  int

Functions can return multiple results, but must be declared
func swap(x, y string)(string, string) {
    return y, x
} 

Name function returns
GO supports named functions and *naked* returns.  This means that 
 - You can declare what you are exporting, those declarations are defined at top of function
 - a simple *return* statement will return the values of declalred values in the parameters
```
func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}
```

Pointers
 *ptr

Exports begin with a capital, internals are lower case

Implicit Values
 - Variables declared without an initial value are given one
 - 0 for numeric
 - false for boolean
 - "" empty string for strings

Type Conversions happen with Type(value) float64(1) 

### Looping
the for loop is it
for init; condition; post;
 - init (optional)- executed before the first iteration
 - condition - evaluated before every iteration
 - post (optional) - executed at end of every iteration

While loop
for i < 1000 {
    i++
} 

infinite loop 
for {

}

### If

Condition parens optional
https://tour.golang.org/flowcontrol/6