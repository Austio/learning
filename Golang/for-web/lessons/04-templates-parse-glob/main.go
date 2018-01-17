package main

import (
  "text/template"
  "os"
  "log"
  )


func main() {
  tmpl, err := template.ParseGlob("./*.gohtml")

  if err != nil {
    log.Fatalln(err)
  }

  tmpl.ExecuteTemplate(os.Stdout, "one.gohtml", nil)
  tmpl.ExecuteTemplate(os.Stdout, "two.gohtml", nil)
}