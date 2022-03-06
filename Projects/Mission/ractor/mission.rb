class Mission
  include Wisper::Publisher
  include HasUuid
  class MissionFailureError < StandardError; end

  def initialize(distance_in_kilometers: 160.0)
    init_uuid!
    @distance_in_kilometers = Float(distance_in_kilometers)

    @rocket = Rocket.new
    @rocker_launcher = RocketLauncher.new(rocket: @rocket)

    broadcast(:mission_initiated, uuid, @rocket.uuid)
  end

  def run!
    broadcast(:mission_planned, { mission_uuid: uuid, rocket_uuid: @rocket.uuid, plan: mission_plan })

    # @rocket.launch_sequence.each do |prelaunch_check|
    #   if prelaunch_check.task.call
    #     publish(:rocket_stage_completed, uuid: uuid, stage: :afterburner_engage)
    #   else
    #     publish(:rocket_stage_failed, uuid: uuid, stage: :afterburner_engage)
    #   end
    # end

    @rocker_launcher.launch do |step|
      gremlin.check(step)
    end
  end

  private

  def mission_plan
    [
      { key: "Travel distance", value: "#{@distance_in_kilometers} km" },
      { key: "Payload capacity", value: "#{@rocket.payload_capacity} kg" },
      { key: "Fuel capacity", value: "#{@rocket.payload_capacity} kg" },
      { key: "Burn rate", value: "#{@rocket.burn_rate} liters/min" },
      { key: "Average speed", value: "#{@rocket.current_speed_in_kilometer_per_hour} km/h" }
    ]
  end

  def say_status
    progress = [
      { key: "Current fuel burn rate", value: "151,416 liters/min" },
      { key: "Current speed", value: "#{@rocket.current_speed} km/h" },
      { key: "Current distance traveled", value: "12.5 km" },
      { key: "Elapsed time", value: "#{elapsed_time}" },
      { key: "Time to destination", value: "0:05:54" },
    ]

      broadcast(:mission_progressed, { mission_uuid: uuid, rocket_uuid: @rocket.uuid, plan: progress })
  end

  private

  def elapsed_time

  end

  def time_to_destination

  end

  def pretty_time

  end
end
