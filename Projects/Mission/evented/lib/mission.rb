class Mission
  include Wisper::Publisher
  include HasUuid
  class MissionFailureError < StandardError; end

  attr_reader :distance

  def initialize
    init_uuid!
    @distance = Unit.new("160 km")

    @rocket = Rocket.new
    @rocket_launcher = RocketLauncher.new(rocket: @rocket, mission: self)

    broadcast(:mission_initiated, uuid, @rocket.uuid)
  end

  def run!
    @name = IO.get("What is the name of this mission?")
    broadcast(:mission_planned, { mission_uuid: uuid, rocket_uuid: @rocket.uuid, plan: mission_plan, name: @name })

    gremlin = Gremlin.new
    @rocket_launcher.launch do |launcher, step|
      gremlin.check(launcher, step)
    end

    FlightSimulator.new(self, @rocket).run!
  end

  def random_point
    m = rand(@distance.convert_to('m').scalar)
    Unit.new("#{m} m").convert_to('km')
  end

  private

  def mission_plan
    [
      { key: "Travel distance",
        value: FormatHelpers.unit_with_commas(@distance.convert_to("km")) },
      { key: "Payload capacity",
        value: FormatHelpers.unit_with_commas(@rocket.payload_capacity.convert_to("kg")) },
      { key: "Fuel capacity",
        value: FormatHelpers.unit_with_commas(@rocket.fuel_capacity.convert_to("liters")) },
      { key: "Burn rate",
        value: FormatHelpers.unit_with_commas(@rocket.burn_rate.convert_to("liters/min")) },
      { key: "Average speed",
        value: FormatHelpers.unit_with_commas(@rocket.average_speed.convert_to("km/h")) }
    ]
  end
end
