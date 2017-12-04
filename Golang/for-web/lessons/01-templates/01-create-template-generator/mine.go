// How would one create a template libary
package main

import "fmt"

func mustache(template string, terms map[string]string) {
	fmt.Println(template, terms)
}

func main() {
	var terms = map[string]string{
		"foo": "bar",
	}

	template := terms["foo"]
	mustache(template, terms)
}
