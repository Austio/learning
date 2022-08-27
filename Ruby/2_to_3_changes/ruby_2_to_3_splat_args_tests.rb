# Ruby with `rspec ./ruby_object_model_tests`
# nodemon -w ./ruby_splat_args_tests.rb -e "rb" --exec "rspec ./ruby_splat_args_tests.rb"

require "bundler/inline"

gemfile do
  gem "pry"
  gem "rspec"
end

# Summary
# method(foo, *bar) -> requires foo, everthing else will be shoveled to an array that is bar in position order
# method(foo, **bar) -> requires foo, everthing else will be shoveled to an object, requires named arguments
# method(*foo, **bar) -> all positional arguments shoveled to foo, everthing else will be shoveled to an object, requires named arguments


# |context|passed|result|
# |---|---|---|
# some_method|some_method|:+1:|
# some_method|some_method(5)|ArgumentError|
# some_method(foo, *bar)|some_method|ArgumentError|
# some_method(foo, *bar)|some_method(1,2,3)|foo = 1, bar = [2,3]|
# some_method(foo, **bar)|some_method(1,2,3)|ArguumentError|
# some_method(*foo, *bar)|some_method(1,2,3)|This is invalid ruby|
# some_method(*foo, **bar)|some_method(1,2,3)|Position arguments to foo, named arguments to bar|

describe "Ruby Splat args" do
  class Watcher
    def spy(foo, bar); end
  end

  it "ArgumentError when method does not support any arguments" do
    def some_method; end

    expect { some_method(5) }.to raise_error(ArgumentError)
  end

  context "argument then single splat" do
    it "with no argument throws an exception" do
      watcher = Watcher.new

      some_method = lambda do |foo, *bar|
        watcher.spy(foo, bar)
      end

      expect { some_method.call() }.to raise_error(ArgumentError)
    end

    it "with no second argument passes an empty array for arguments" do
      watcher = Watcher.new

      some_method = lambda do |foo, *bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with(1, [])
      some_method.call(1)
    end

    it "with primitives shovels to array" do
      watcher = Watcher.new

      some_method = lambda do |foo, *bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with(1, [2,3])
      some_method.call(1,2,3)
    end

    it "with options hash collects those values to a hash" do
      watcher = Watcher.new

      some_method = lambda do |foo, *bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with(1, [2,3, {this: 'that', the: 'other'}])
      some_method.call(1, 2, 3, this: 'that', the: 'other')
    end

    it "with array and options and primative puts in the arguments to splatted" do
      watcher = Watcher.new

      some_method = lambda do |foo, *bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with(1, [2,3, [4,5], {this: 'that', the: 'other'}])
      some_method.call(1, 2, 3, [4,5], this: 'that', the: 'other')
    end
  end

  context "argument then double splat" do
    it "with no argument throws an exception" do
      watcher = Watcher.new

      some_method = lambda do |foo, **bar|
        watcher.spy(foo, bar)
      end

      expect { some_method.call() }.to raise_error(ArgumentError)
    end

    it "with no second argument passes an empty object for arguments" do
      watcher = Watcher.new

      some_method = lambda do |foo, **bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with(1, {})
      some_method.call(1)
    end

    it "with primitives throws exectpion due to second arguments not being named hash" do
      watcher = Watcher.new

      some_method = lambda do |foo, **bar|
        watcher.spy(foo, bar)
      end

      expect { some_method.call(1,2,3) }.to raise_error(ArgumentError)
    end

    it "with options hash collects those values to a hash" do
      watcher = Watcher.new

      some_method = lambda do |foo, **bar|
        watcher.spy(foo, bar)
      end

      expect do
        some_method.call(1, 2, 3, this: 'that', the: 'other')
      end.to raise_error(ArgumentError)
    end

    it "with named second arguments shovels to object" do
      watcher = Watcher.new

      some_method = lambda do |foo, **bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with(1, {this: 'that', the: 'other'})
      some_method.call(1, this: 'that', the: 'other')
    end
  end

  context "splat argument then double splat" do
    it "with no argument throws an exception" do
      watcher = Watcher.new

      some_method = lambda do |*foo, **bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with([], {})
      some_method.call()
    end

    it "with multiple arguments then named arguments" do
      watcher = Watcher.new

      some_method = lambda do |*foo, **bar|
        watcher.spy(foo, bar)
      end

      expect(watcher).to receive(:spy).with([1,2,3], { foo: 'bar'})
      some_method.call(1,2,3, foo: 'bar')
    end
  end
end

def foo(arg, options = {})
  puts "foo(#{arg.inspect}, #{options.inspect})"
end

def bar(arg, **options)
  puts "bar(#{arg.inspect}, **#{options.inspect})"
end

def asdf(arg, test: nil)
  puts "asdf(#{arg.inspect}, test: #{test.inspect})"
end

options = { test: true }

foo('a', options) # valid
foo('a', **options) # ruby 2.6 warning, rubocop warning, invalid for ruby3?
foo('a', test: true) # invalid for ruby3?
foo('a', **options, test: false) # ruby 2.6 warning, rubocop warning, invalid for ruby3?

bar('b', options) # invalid for ruby3?
bar('b', **options) # valid, rubocop warning
bar('b', test: true) # valid
bar('b', **options, test: false) # valid, rubocop warning

asdf('c', options) # invalid for ruby3?
asdf('c', **options) # valid, rubocop warning
asdf('c', test: true) # valid
asdf('c', **options, test: false) # valid, rubocop warning

