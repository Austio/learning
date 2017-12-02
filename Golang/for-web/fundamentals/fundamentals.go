package main

import "fmt"

var packageScope string

func main() {
    packageScope = "foo"
    fmt.Println(packageScope)
    blockScopeX := 7
    fmt.Println(blockScopeX)
    fmt.Printf("%T\n", blockScopeX)
}