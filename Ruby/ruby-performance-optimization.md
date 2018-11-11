### 1. What makes Ruby Slow

```
require 'benchmark'

rows = 100000
cols = 10

data = Array.new(rows) { Array.new(cols) { "X"*1000 } }

puts "%d MB" % (`ps -o rss= -p #{Process.pid}`.to_i/1024)

time = Benchmark.realtime do 
  csv = data.map { |r| r.join(",") }.join("|n")
end

puts "%d MB" % (`ps -o rss= -p #{Process.pid}`.to_i/1024)

GC.disable
no_gc_time = Benchmark.realtime do 
  csv = data.map { |r| r.join(",") }.join("|n")
end

puts "%d MB" % (`ps -o rss= -p #{Process.pid}`.to_i/1024)

puts "GCed: #{time}\nNoGC: #{no_gc_time}"

1061 MB
2995 MB
4941 MB
#GCed: 2.4029310001060367
#NoGC: 1.4104139999253675
```

- Memory Consumption and GC are major slowdowns in ruby
- Ruby has significant memory overhead
  - High memory consumption is intrinsic in Ruby due to the 'everything is an object' mantra.  Programs need extra memory to represent data as objects.
- Raw Ruby performance in interpreter is about the same
  - Without GC most code executes in same speed from Ruby 1.8 up to 2.5, GC is the main change in each version
