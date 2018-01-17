package main

import (
  "text/template"
  "os"
)

var tmpl *template.Template

func init() {
  tmpl = template.Must(template.ParseGlob("./*.gohtml"))
}

func main() {
  tmpl.ExecuteTemplate(os.Stdout, "one.gohtml", nil)
  tmpl.ExecuteTemplate(os.Stdout, "two.gohtml", nil)
}