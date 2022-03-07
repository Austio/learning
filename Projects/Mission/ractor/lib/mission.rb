class Mission
  include Wisper::Publisher
  include HasUuid
  class MissionFailureError < StandardError; end

  attr_reader :distance_in_kilometers

  def initialize(distance_in_kilometers: 160.0)
    init_uuid!
    @distance_in_kilometers = Float(distance_in_kilometers)

    @rocket = Rocket.new
    @rocket_launcher = RocketLauncher.new(rocket: @rocket)

    broadcast(:mission_initiated, uuid, @rocket.uuid)
  end

  def run!
    # @name = IO.get("What is the name of this mission?")
    @name = "Mission"
    broadcast(:mission_planned, { mission_uuid: uuid, rocket_uuid: @rocket.uuid, plan: mission_plan, name: @name })

    gremlin = Gremlin.new
    @rocket_launcher.launch do |launcher, step|
      gremlin.check(launcher, step)
    end

    FlightSimulator.new(self, @rocket).run!
  end

  private

  def mission_plan
    [
      { key: "Travel distance", value: "#{@distance_in_kilometers} km" },
      { key: "Payload capacity", value: "#{@rocket.payload_capacity} kg" },
      { key: "Fuel capacity", value: "#{@rocket.fuel_capacity} kg" },
      { key: "Burn rate", value: "#{@rocket.burn_rate} liters/min" },
      { key: "Average speed", value: "#{@rocket.average_speed} km/h" }
    ]
  end
end
