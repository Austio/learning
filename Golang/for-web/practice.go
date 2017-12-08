package main

import "math"
import "fmt"


func main {
  result := step(2,100, 110)
  
  fmt.Println(result)
}

func isPrime(primes, n) {
  for _, v := range primes {
    if (math.Mod(v, n) == 0) {
      return false;
    }
  }

  return true;
}

func step(g, m, n int) []int {
  primes := [1]int{2}

  for i := 3; i <= n; i++ {
    if (isPrime(primes, i)) {
      lastPrime := sl[len(sl)-1]
      stepsApart := i - lastPrime
      if (stepsApart == m) {
		foundValue := make([]int, 0, 2)
		foundValue.append(lastPrime, i)  
        return foundValue
      }
    
      append(primes, i)
    }
  }

  return nil
}
