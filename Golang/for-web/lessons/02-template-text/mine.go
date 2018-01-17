package main

import (
	"log"
	"os"
	"text/template"
)

func main() {
	t, err := template.ParseFiles("./index.go.html")
	err = t.Execute(os.Stdout, nil)

	if err != nil {
		log.Fatalln(err)
	}

}
