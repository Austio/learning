// How would one create a template libary
package main

import "fmt"

func mustache(template string) {
	fmt.Println(template)
}

func main() {
	template := "foo"
	mustache(template)
}
