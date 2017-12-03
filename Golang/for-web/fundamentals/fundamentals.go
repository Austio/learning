package main

import (
	"fmt"
	"math"
	"time"
)

var packageScope string

func printLineStuff() {
	packageScope = "foo"
	fmt.Println(packageScope)
	blockScopeX := 7
	fmt.Println(blockScopeX)
	fmt.Printf("%T\n", blockScopeX)

	fmt.Printf("The time is\n", time.Now())

	fmt.Printf("Now you have %g problems.\n", math.Sqrt(7))
}

type person struct {
	first string
	last  string
}

type secretAgent struct {
	person
	licenseToKill bool
}

type human interface {
	speak()
}

func (p person) speak() {
	fmt.Println(p.first, p.last, ": good to see you mister bond")
}

func (sa secretAgent) speak() {
	fmt.Println(sa.person.first, sa.person.last, ": shaken, not stirred")
}

func saySomething(h human) {
	h.speak()
}

func demoPolymorphism() {
	mp := person{
		"Miss",
		"Moneypenny",
	}

	james := secretAgent{
		person{
			"James",
			"Bond",
		},
		true,
	}

	saySomething(mp)
	saySomething(james)
}

func main() {
	printLineStuff()
	demoPolymorphism()
}
