package main

import (
	"fmt"
)

func main() {
	var (
		odd   int
		even  int
		total int
	)

	numbers := []int{0, 1, 2, 3, 7, 4, 5}

	// Count number of even, odd and total
	// Don't count 0
	// Stop counting if you hit a 7
	for _, num := range numbers {
		total++
		if num == 0 {
			// Continue stops this iteration of the loop and starts at top with next iteratee
			continue
		}

		if num == 7 {
			// Exits loop completely
			break
		}

		if num%2 == 0 {
			even++
		} else {
			odd++
		}
	}

	fmt.Printf("Even %d, Odd %d\nTotal %d\n", odd, even, total)
}
