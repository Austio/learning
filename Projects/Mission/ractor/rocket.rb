class Rocket
  include Wisper::Publisher
  include HasUuid

  class LaunchStep
    attr_reader :task, :name, :order

    def initialize(task:, identifier:)
      @task = task
      @identifier = identifier
    end
  end

  def initialize(payload_capacity: 50000,
                 fuel_capacity: 1514100,
                 burn_rate: 168240,
                 average_speed: 1500)

    @payload_capacity = payload_capacity
    @fuel_capacity = fuel_capacity
    @burn_rate = burn_rate
    @average_speed = average_speed
    @prepared = false
    @launched = false

    init_uuid!
  end

  def payload_capacity
    @payload_capacity
  end

  def fuel_capacity
    @payload_capacity
  end

  def burn_rate
    @burn_rate
  end

  def current_speed_in_kilometer_per_hour
    @average_speed
  end
end
