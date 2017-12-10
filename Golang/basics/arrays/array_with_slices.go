package main

import "fmt"

var groceries []int

func push(val int) {
	fmt.Println(cap(groceries))
	fmt.Println(len(groceries))
	fmt.Println(&groceries)

	groceries = append(groceries, val)
}

func print() {
	fmt.Println("Groceries", &groceries, groceries)
}

func main() {
	for i := 0; i < 10; i++ {
		push(i)
	}

	print()
}
