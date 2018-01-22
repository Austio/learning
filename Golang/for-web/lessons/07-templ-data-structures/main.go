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

func main() {
	demoStruct()

}
