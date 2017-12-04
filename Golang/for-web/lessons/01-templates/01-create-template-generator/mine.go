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

	for k, v := range dict {
		r, _ := regexp.Compile(fmt.Sprintf("{{%v}}", k))
		template = r.ReplaceAllString(template, v)
	}

	fmt.Println(template)
}

func main() {
	interp("Using printf!")
	fmt.Printf("\n\n")

	var terms = map[string]string{
		"title": "Using Mustache Syntax",
		"body":  "Insightful Content",
	}

	template := "<DOCTYPE html><head><title>{{title}}<title></head><body>{{body}}</body></html>"
	mustache(template, terms)
}
