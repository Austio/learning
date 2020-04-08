class Notifier
  def initialize
    @subscribers = []
  end

  def publish(message, payload = nil)
    @subscribers.each do |subscriber|
      if (subscriber.message == message)
        subscriber.listener.notify(message, payload)
      end
    end

    if message == 'aborted_inflight'
      puts "WOO HOO aborted inflight"
    end
  end

  def subscribe(message, obj)
    listener = OpenStruct.new(message: message, listener: obj)

    @subscribers.push(listener)
  end

  def unsubscribe(message, obj)
  end
end