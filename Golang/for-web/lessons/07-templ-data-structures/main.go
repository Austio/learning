package main

import (
	"os"
	"text/template"
)

var tmpl *template.Template

type tmplStruct struct {
}

func init() {
	tmpl = template.Must(template.ParseGlob("./*.gohtml"))
}

func demoStruct() {
	// https://talks.golang.org/2012/10things.slide#2
	data := struct {
		Title  string
		People []string
	}{
		"Struct Demo",
		[]string{"Jim", "John", "Patsy"},
	}

	tmpl.ExecuteTemplate(os.Stdout, "struct.gohtml", data)
}

func demoMap() {
	d := map[string]string{
		"first":  "Jim",
		"second": "John",
		"third":  "Patsy",
	}

	tmpl.ExecuteTemplate(os.Stdout, "map.gohtml", d)
}

type Person struct {
	Name   string
	Saying string
}

var a = Person{
	Name:   "jim",
	Saying: "hiya",
}

var b = Person{
	Name:   "john",
	Saying: "yepper",
}

var ppl = []Person{a, b}

func demoSliceStruct() {
	tmpl.ExecuteTemplate(os.Stdout, "structSlice.gohtml", ppl)
}

type html struct {
	Title  string
	People []Person
}

func demoStructSliceStruct() {
	d := html{
		Title:  "StructSlicStruct",
		People: ppl,
	}

	tmpl.ExecuteTemplate(os.Stdout, "structSliceStruct.gohtml", d)
}

func main() {
	demoStruct()
	demoMap()
	demoSliceStruct()
	demoStructSliceStruct()
}
