package main

import (
	"log"
	"os"
	"text/template"
	"fmt"
)

func main() {
    fmt.Println("Reading in template...")
	type Page struct {
	  Title string
	  Body string
	}

    p := Page{"Hiya", "<p>Body</p>"}

	tpl, err := template.ParseFiles("./index.go.html")
	err = tpl.Execute(os.Stdout, p)

	if err != nil {
		log.Fatalln(err)
	}

}
