### 1. What makes Ruby Slow

- Memory Consumption and GC are major slowdowns in ruby
- Ruby has significant memory overhead
  - High memory consumption is intrinsic in Ruby due to the 'everything is an object' mantra.  Programs need extra memory to represent data as objects.
- Raw Ruby performance in interpreter is about the same
  - Without GC most code executes in same speed from Ruby 1.8 up to 2.5, GC is the main change in each version
- 80-20 Rule - 80% of optimization is from memory
- Ask these three questions
 1. Is Ruby the Right Tool (GC causes issues for large datasets, statistics)
 2. How much memory will code use (reduce where possible)
 3. What is the raw performance of the code (after memory, optimize others)

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

To fix the GC and memory bloat don't store any intermediate results. 
```
require 'benchmark'

rows = 100000
cols = 10

data = Array.new(rows) { Array.new(cols) { "X"*1000 } }
better_time = Benchmark.realtime do 
  csv = ''
  rows.times do |i|
    cols.times do |j|
      csv << data[i][j]
      csv << ',' unless j == cols - 1
    end
    csv << "\n" unless i = cols - 1
  end
end

# time: 1.1365
```
