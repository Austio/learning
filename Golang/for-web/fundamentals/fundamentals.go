package main

import (
	"fmt"
	"math"
	"time"
)

var packageScope string

func printing() {
	packageScope = "foo"
	fmt.Println(packageScope)
	blockScopeX := 7
	fmt.Println(blockScopeX)
	fmt.Printf("%T\n", blockScopeX)

	fmt.Printf("The time is\n", time.Now())

	fmt.Printf("Now you have %g problems.\n", math.Sqrt(7))
}

func interfacesAndTypes() {
  type person struct {
    first string
    last string
  }

  type secretAgent struct {
    person
    licenseToKill bool
  }

  type human interface {
    speak()
  }

  func (secretAgent) speak() {
    fmt.Println(secretAgent.last, "regular")
  }

  func (sa secretAgent) speak() {
    fmt.printLn(sa.last, "licence to kill")
  }

  james := secretAgent(
    person() {
      "James",
      "Bond"
    },
    true
  )

  james.speak()
}


func main() {
  printing()
}