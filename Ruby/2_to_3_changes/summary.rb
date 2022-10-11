show_keyword = ENV["TEST"] == "keyword"
show_proc = ENV["TEST"] == "proc"

puts ""
puts "#{RUBY_VERSION} - Ruby Version"

# https://rubyreferences.github.io/rubychanges/3.0.html
# https://bugs.ruby-lang.org/issues/14183
# https://www.ruby-lang.org/en/news/2019/12/12/separation-of-positional-and-keyword-arguments-in-ruby-3-0/
if show_keyword
  puts "Testing Keywords"
  def no_kwarg(a, b, c, hsh)
    p hsh[:key]
  end
  p "no_kwarg"
  no_kwarg(1, 2, 3, key: 42)

  def explicit_rest_arg(a, b, c, **hsh)
    p hsh[:key]
  end
  p "explicit_rest_arg"
  explicit_rest_arg(1, 2, 3, key: 42)

  def implicit_rest_arg(a, b, c, key: 1)
    p key
  end
  h = { key: "overwriding" }
  p "pass: because pushing the hash to a keyword arg"
  implicit_rest_arg(1, 2, 3, **h)

  p "fail: explicit_rest_arg"
  # implicit_rest_arg(1, 2, 3, h)
end

if show_proc
  puts "Proc - autosplat change"
  block = proc { |*args, **kwargs| puts "args=#{args}, kwargs=#{kwargs}"}
  block.call(1, 2, a: true)
  block.call(1, 2, {a: true})
end
