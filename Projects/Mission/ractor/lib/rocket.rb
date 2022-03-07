class Rocket
  include Wisper::Publisher
  include HasUuid

  class InvalidCommandError < StandardError; end

  class RocketFlyStatus
    attr_reader :velocity, :fuel_burn_rate

    def initialize(fuel_burn_rate:, velocity:)
      @velocity = velocity
      @fuel_burn_rate = fuel_burn_rate
    end
  end

  attr_reader :payload_capacity, :fuel_capacity, :burn_rate, :average_speed

  def initialize(payload_capacity: 50000,
                 fuel_capacity: 1514100,
                 burn_rate: 168240,
                 average_speed: 1500)

    @payload_capacity = payload_capacity
    @fuel_capacity = fuel_capacity
    @burn_rate = burn_rate
    @average_speed = average_speed
    @launched = false

    @current_fuel_remaining = @fuel_capacity

    init_uuid!
  end

  def launch!
    @launched = true
  end

  def launched?
    @launched
  end

  def fly(seconds)
    if !launched?
      raise InvalidCommandError.new("Cannot fly rocket until launched")
    end

    burn_rate = get_current_fuel_burn_rate
    current_velocity = get_current_velocity

    @current_fuel_remaining = @current_fuel_remaining - liters_of_fuel_used_for_duration(burn_rate, seconds)

    RocketFlyStatus.new(fuel_burn_rate: burn_rate, velocity: current_velocity)
  end

  private

  def liters_of_fuel_used_for_duration(burn_rate, seconds)
    burn_rate / 60 * seconds
  end

  def get_current_velocity
    @average_speed + variance_adjustment(100)
  end

  def get_current_fuel_burn_rate
    @burn_rate + variance_adjustment(1000)
  end

  def variance_adjustment(within_number)
    rand(within_number) * [1, -1].sample
  end
end
