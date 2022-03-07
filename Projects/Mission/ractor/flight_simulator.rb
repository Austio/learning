class FlightSimulator
  include Wisper::Publisher

  def initialize(mission, rocket)
    @mission = mission
    @rocket = rocket

    @total_time = 0
    @total_distance_traveled = 0
  end

  def run!
    return status_aborted if !@rocket.launched?

    time_increment = 120
    loop do
      status = @rocket.fly(time_increment)

      @total_time = @total_time + time_increment

      distance_traveled = Float(status.velocity) / 60 /60 * time_increment
      @total_distance_traveled = @total_distance_traveled + distance_traveled

      distance_remaining = @mission.distance_in_kilometers * 1000 - @total_distance_traveled
      remaining_time = (distance_remaining / 1000 ) / status.velocity

      status_update(fuel_burn_rate: status.fuel_burn_rate,
                    velocity: status.velocity,
                    remaining_time: remaining_time)

      if @total_distance_traveled >= (@mission.distance_in_kilometers * 1000)
        status_completed
        break
      end
      sleep 1
    end
  end

  private

  def status_completed
    broadcast(:flight_simulator_complete_successful, { mission_uuid: @mission.uuid,
                                                    rocket_uuid: @rocket.uuid,
                                                    total_time_in_seconds: @total_time,
                                                    total_distance_in_km: @total_distance_traveled })
  end

  def status_aborted
    broadcast(:flight_simulator_complete_aborted, { mission_uuid: @mission.uuid,
                                                    rocket_uuid: @rocket.uuid,
                                                    total_time_in_seconds: @total_time,
                                                    total_distance_in_km: @total_distance_traveled })
  end

  def status_update(fuel_burn_rate:, velocity:, remaining_time:)
    progress = [
      { key: "Current fuel burn rate", value: "#{fuel_burn_rate} liters/min" },
      { key: "Current speed", value: "#{velocity} km/h" },
      { key: "Current distance traveled", value: "#{@total_distance_traveled} km" },
      { key: "Elapsed time", value: "#{@total_time}" },
      { key: "Time to destination", value: remaining_time },
    ]

    broadcast(:flight_simulator_progressed, { mission_uuid: @mission.uuid,
                                              rocket_uuid: @rocket.uuid,
                                              plan: progress })
  end

  def elapsed_time

  end

  def time_to_destination

  end

  def pretty_time

  end
end
