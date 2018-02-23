package main

import (
	"os"
	"log"
	"text/template"
)

var tmpl *template.Template

func init() {
	tmpl = template.Must(template.ParseGlob("templates/*.gohtml"))
}

type foo struct {
	Inner string
	Outer string
}

func main() {
  f := foo{"In", "Out"}

  err := tmpl.ExecuteTemplate(os.Stdout, "index.gohtml", f)
  if err != nil {
  	log.Fatalln(err)
  }
}