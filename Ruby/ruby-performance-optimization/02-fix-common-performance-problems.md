### Chapter 2 Common Performance Problems
See [Benchmark](./benchmark.rb) for a really great memory calculator for ruby
 - Common slowness: extra malloc, data structure copying, Execution Context Copy, Memory Heavy Iterator, slow type conversions
 
#### Save Memory

##### Modify String in place
 - Use !bang methods to manipulate in place
 - gsub!, capitalize!, downcase!, upcase!, delete!, reverse!, slice!, etc
 - use when you can afford to
 
```
require 'benchmark'

str = "X" * 1024 * 1024 * 10
a = measure { new = str.gsub('X', 'Y') }
b = measure { str.gsub!('X', 'A') }

a + b 
```  

Use `String::<<` to concat strings.  It does it in a way that allocates less memory and does not trigger GC

```
a = "foo"
a += "bar"

a = "foo"
a << "bar"
```

##### Modify Array/Hash in Place
 - Similar to with strings, this can be a huge time savings
 
```
data = Array.new(100) { 'x' * 1024 * 1014 * 10 }

measure { data.map(&:upcase) }  
{"2.4.1":{"gc":"enabled","time":3.27,"gc_count":26,"memory":"832 MB"}}

measure { data.map!(&:upcase!) }  
{"2.4.1":{"gc":"enabled","time":3.42,"gc_count":26,"memory":"10 MB"}}
``` 

##### Read Files line by line
 - File.read: Pulls in entire file then manipulates
 - File.readlines: Pulls in line by line
 
CSV requires 13 times memory of file size.  Speed improvement will be between 20 and 35% faster






