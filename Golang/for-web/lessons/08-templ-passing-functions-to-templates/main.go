package main

import (
	"text/template"
	"os"
  "strings"
)

var fm = template.FuncMap{
  "uc": strings.ToUpper,
  "ft": firstThree,
}

func firstThree(s string) string {
  f := strings.TrimSpace(s)
  ft := f[:3]
  return ft
}

var tmpl *template.Template

func init() {
  tmpl = template.Must(template.New("").Funcs(fm).ParseGlob("./*.gohtml"))
}

func main() {
  s := struct {
    Foo string
  } {
    "initially-lower",
  }

  tmpl.ExecuteTemplate(os.Stdout, "foo.gohtml", s)
}