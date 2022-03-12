class EventMissionLogger
  def initialize
    @events = []
  end

  def method_missing(symbol, *args)
    @events.unshift({ event: symbol, data: args })

    IO.put("*** STATUS #{symbol} #{args}")
  end

  def respond_to_missing?(symbol, *args)
    true
  end
end
