package main

import (
	"text/template"
)

func main() {
	t, err1 = template.ParseFiles("./index.go.html")

	err2 = template.Execute(t)
}
