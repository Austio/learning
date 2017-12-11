package main

import "fmt"

var groceries []int

// newGroceries is a slice, ...int is a variadic function
func push(newGroceries ...int) {
	print()

	// the index is _, it is mandatory for assignment return
	for _, elm := range newGroceries {
		groceries = append(groceries, elm)
	}
}

func print() {
	fmt.Println(cap(groceries))
	fmt.Println(len(groceries))
	fmt.Println(groceries)
}

func main() {
	for i := 0; i < 10; i++ {
		push(i, 0)
	}

	print()
}
