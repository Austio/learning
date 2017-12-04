// How would one create a template libary
package main

import (
	"fmt"
	"regexp"
)

func interp(title string) {
	fmt.Printf("<DOCTYPE html><head><title>%v<title></head><body>Hiya</body></html>", title)
}

func mustache(template string, dict map[string]string) {
	fmt.Println("initial:", template, dict)

	r, _ := regexp.Compile("{{title}}")
	newTemplate := r.ReplaceAllString(template, dict["title"])

	fmt.Println(newTemplate)
}

func main() {
	interp("Using printf!")
	fmt.Printf("\n\n")

	var terms = map[string]string{
		"title": "Using Mustache Syntax",
	}

	template := "<DOCTYPE html><head><title>{{title}}<title></head><body>Hiya</body></html>"
	mustache(template, terms)
}
