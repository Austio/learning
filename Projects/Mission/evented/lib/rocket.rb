class Rocket
  include Wisper::Publisher
  include HasUuid
  include Doomable

  class InvalidCommandError < StandardError; end

  class RocketFlyStatus
    attr_reader :velocity, :fuel_burn_rate

    def initialize(fuel_burn_rate:, velocity:)
      @velocity = velocity
      @fuel_burn_rate = fuel_burn_rate
    end
  end

  attr_reader :payload_capacity, :fuel_capacity, :burn_rate, :average_speed

  def initialize
    @payload_capacity = Unit.new("50000 kg")

    @burn_rate = Unit.new("168240 liters/min").convert_to("liters/sec")
    @average_speed = Unit.new("1500 km/hour").convert_to("km/sec")

    @fuel_capacity = Unit.new("1514100 liters")
    @initial_fuel_remaining = Unit.new("1514100 liters")
    @current_fuel_remaining = Unit.new("1514100 liters")

    @launched = false

    init_uuid!
  end

  def launch!
    @launched = true
  end

  def launched?
    @launched
  end

  def fuel_used
    @initial_fuel_remaining - @current_fuel_remaining
  end

  def fuel_remaining
    @current_fuel_remaining
  end

  def fly(seconds)
    if !launched?
      raise InvalidCommandError.new("Cannot fly rocket until launched")
    end

    burn_rate = get_current_fuel_burn_rate
    current_velocity = get_current_velocity

    fuel_used = burn_rate * seconds
    @current_fuel_remaining = @current_fuel_remaining - fuel_used
    RocketFlyStatus.new(fuel_burn_rate: burn_rate, velocity: current_velocity)
  end

  private

  def get_current_velocity
    adjustment = Unit.new("#{variance_adjustment(100)} km/h").convert_to("km/sec")

    @average_speed + adjustment
  end

  def get_current_fuel_burn_rate
    adjustment = Unit.new("#{variance_adjustment(1000)} liters/min").convert_to("liters/sec")

    @burn_rate + adjustment
  end

  def variance_adjustment(within_number)
    rand(within_number) * [1, -1].sample
  end
end
