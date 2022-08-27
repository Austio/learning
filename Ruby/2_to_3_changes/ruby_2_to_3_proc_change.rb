require "bundler/inline"

gemfile do
  gem "activesupport"
  gem "pry"
end

require "active_support/notifications"

obj = { foo: "bar" }

class Something
  def call(args)
    puts "Something.call received args as: #{args}"
  end
end

class MessageBus
  POLICY_NOT_FOUND = "dox_graphql_core.policy.failure"
  POLICY_UNAUTHORIZED = "dox_graphql_core.policy.unauthorized"
  POLICY_PERMISSIONS_MISSING = "dox_graphql_core.policy.permissions_missing"

  class << self
    def subscribers
      @subscribers ||= []
    end

    def unsubscribe(target)
      ActiveSupport::Notifications.unsubscribe(target)
    end

    # rubocop:disable Style/MultilineBlockChain
    def subscribe(target)
      ActiveSupport::Notifications.subscribe(target) do |_event_name, **payload|
        yield payload
      end.tap { |subscription| subscribers.push(subscription) }
    end
    # rubocop:enable Style/MultilineBlockChain

    def publish(target, message)
      ActiveSupport::Notifications.publish(target, message)
    end

    def policy_unauthorized(message)
      publish(POLICY_UNAUTHORIZED, message)
    end

    def on_policy_unauthorized(&block)
      subscribe(POLICY_UNAUTHORIZED, &block)
    end
  end
end

MessageBus.on_policy_unauthorized do |message|
  puts "MessageBus on_policy_unauthorized block yielded ars of: #{message}"
  Something.new.call(message)
end

puts "Dispatching policy_unauthorized with: #{obj}"
MessageBus.policy_unauthorized(obj)

# Ruby 2.7.6
# Dispatching policy_unauthorized with: {:foo=>"bar"}
# MessageBus on_policy_unauthorized block yielded ars of: {:foo=>"bar"}
# Something.call received args as: {:foo=>"bar"}

# Ruby 3.0
# Calling with obj {:foo=>"bar"}
# in block with: {}
# ./ruby_2_to_3_proc_change.rb:6:in `call': wrong number of arguments (given 0, expected 1) (ArgumentError)

# Ruby 3.1.2
# Dispatching policy_unauthorized with: {:foo=>"bar"}
# MessageBus on_policy_unauthorized block yielded ars of: {}
# Something.call received args as: {}
