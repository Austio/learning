package main

import "fmt"

var groceries [5]string
var last_g int = 0

func print() {
	for i := 0; i < len(groceries); i++ {
		fmt.Println(groceries[i])
	}
}

func add(a string) {
	if last_g >= len(groceries) {
		fmt.Println("cant add anymore")
	} else {
		groceries[last_g] = a
		last_g++
	}
}

func main() {
	fmt.Println(len(groceries))

	add("celery")
	add("brocolli")
	add("cheese")
	add("beef")
	add("cereal")
	add("candy")

	print()
}
