# Ruby with `rspec ./ruby_object_model_tests`
# nodemon -w ./ruby_object_model_tests.rb -e "rb" --exec "rspec ./ruby_object_model_tests.rb"

require "bundler/inline"

gemfile do
  gem "pry"
  gem "rspec"
end

describe "Ruby Object Model" do
  before(:each) do
    class Example
      def self.example_class_method
        "example_class_method"
      end

      def example_instance_method
        "example_instance_method"
      end
    end

    module Extension
      def extension_method
        "extension"
      end
    end
  end

  after(:each) do
    Object.send(:remove_const, :Example)
    Object.send(:remove_const, :Extension)
  end

  context "including and extending" do
    it "has extension_method value when included or extended" do
      expect(Example).not_to respond_to(:extension_method)
      expect(Example.new).not_to respond_to(:extension_method)

      class Example
        include Extension
      end

      expect(Example).not_to respond_to(:extension_method)
      expect(Example.new.extension_method).to eql("extension")

      class Example
        extend Extension
      end

      expect(Example.extension_method).to eql("extension")
      expect(Example.new.extension_method).to eql("extension")
    end
  end

  context "self" do
    it "for class methods, the class is Class" do
      module Extension
        def extended_my_class
          self.class.to_s
        end
      end

      class Example
        extend Extension

        def self.my_class
          self.class.to_s
        end
      end

      expect(Example.my_class).to eql("Class")
      expect(Example.extended_my_class).to eql("Class")
    end

    it "for instance methods, is the including class because we have an explicit receiver" do
      module Extension
        def included_my_class
          self.class.to_s
        end
      end

      class Example
        include Extension

        def my_class
          self.class.to_s
        end
      end

      expect(Example.new.my_class).to eql("Example")
      expect(Example.new.included_my_class).to eql("Example")
    end

    it "self in class_eval" do
      module Extension
        def included_my_class
          self.class.to_s
        end
      end

      class Example
        include Extension

        def my_class
          self.class.to_s
        end
      end

      instance = Example.new

      outer = nil

      Example.class_eval do
        outer = self.class.name
      end
      expect(outer).to eql("Class")

      Example.instance_eval do
        outer = self.class.name
      end
      expect(outer).to eql("Class")

      instance.instance_eval do
        outer = self.class.name
      end
      expect(outer).to eql("Example")
    end
  end

  context "method lookup and precedence" do
    it "looks up self then eigenclasses, then includes in order of definition" do
      module First
        def local
          "First"
        end

        def override
          "First"
        end

        def first
          "First"
        end

        def second
          "First"
        end
      end

      module Second
        def local
          "Second"
        end

        def override
          "Second"
        end

        def first
          "Second"
        end

        def second
          "Second"
        end
      end

      class Example
        include First
        include Second

        def local
          "Example"
        end

        def override
          "Example"
        end
      end

      instance = Example.new
      expect(instance.local).to eql("Example")
      expect(instance.override).to eql("Example")
      expect(instance.first).to eql("Second")
      expect(instance.second).to eql("Second")

      Object.send(:remove_const, :Example)

      # Reversing the order of includes from above
      class Example
        include Second
        include First

        def local
          "Example"
        end

        def override
          "Example"
        end
      end

      instance = Example.new
      expect(instance.local).to eql("Example")
      expect(instance.override).to eql("Example")
      expect(instance.first).to eql("First")
      expect(instance.second).to eql("First")

      def instance.first
        "Eigenclass First"
      end

      # This redefines local
      def instance.local
        "Eigenclass Local"
      end

      expect(instance.local).to eql("Eigenclass Local")
      expect(instance.override).to eql("Example")
      expect(instance.first).to eql("Eigenclass First")
      expect(instance.second).to eql("First")
    end
  end

  describe "defining methods" do
    it "class_eval vs instance_eval on a class" do
      class Example
      end

      # Evaluated in the context of the class definition
      # class_eval exists on 'Module', so receiver will be a Class or Module objects
      # so it will create instance method of the Example.say_hi
      Example.class_eval do
        def say_hi
          "class_eval hi"
        end
      end

      # Evaluated in the contet of the instance of the Example, which is a class
      # instance_eval exists on 'Object', so receiver will be an object
      # is the same as defining with foo, so will create references that become instance methods
      # Example.new.say_hi
      Example.instance_eval do
        def say_hi
          "instance_eval hi"
        end
      end

      expect(Example.say_hi).to eql("instance_eval hi")
      expect(Example.new.say_hi).to eql("class_eval hi")
    end
  end
end
