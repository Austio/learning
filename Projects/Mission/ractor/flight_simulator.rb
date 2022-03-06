class FlightSimulator
  include Wisper::Publisher

  def initialize(mission, rocket)
    @mission = mission
    @rocket = rocket

    @total_time = 0
    @total_distance = 0
  end

  def run!
    return status_aborted if !@rocket.launched?

    time_increment = 60
    while gets
      status = @rocket.fly(time_increment)

      @total_time = @total_time + time_increment

      distance_traveled = status.velocity / 60 * time_increment
      @total_distance = @total_distance + distance_traveled
      status_update(status)

      if @total_distance >= (@mission.distance_in_kilometers * 1000)
        status_completed
        break
      end
    end
  end

  private

  def status_completed
    broadcast(:flight_simulator_complete_successful, { mission_uuid: @mission.uuid,
                                                    rocket_uuid: @rocket.uuid,
                                                    total_time_in_seconds: @total_time,
                                                    total_distance_in_km: @total_distance })
  end

  def status_aborted
    broadcast(:flight_simulator_complete_aborted, { mission_uuid: @mission.uuid,
                                                    rocket_uuid: @rocket.uuid,
                                                    total_time_in_seconds: @total_time,
                                                    total_distance_in_km: @total_distance })
  end

  def status_update(flight_status)
    progress = [
      { key: "Current fuel burn rate", value: "#{flight_status.fuel_burn_rate} liters/min" },
      { key: "Current speed", value: "#{flight_status.velocity} km/h" },
      { key: "Current distance traveled", value: "#{@total_distance} km" },
      { key: "Elapsed time", value: "#{@total_time}" },
      { key: "Time to destination", value: "0:05:54" },
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
