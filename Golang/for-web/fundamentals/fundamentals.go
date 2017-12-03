package main

import (
	"fmt"
	"math"
	"time"
)

var packageScope string

func main() {
	packageScope = "foo"
	fmt.Println(packageScope)
	blockScopeX := 7
	fmt.Println(blockScopeX)
	fmt.Printf("%T\n", blockScopeX)

	fmt.Printf("The time is\n", time.Now())

	fmt.Printf("Now you have %g problems.\n", math.Sqrt(7))
}
