class FlightSimulator
  include Wisper::Publisher

  def initialize(mission, rocket)
    @mission = mission
    @rocket = rocket

    @total_time = Unit.new("0 sec")
    @total_distance_traveled = Unit.new("0 km")
  end

  def run!
    return status_aborted if !@rocket.launched?
    return status_exploded if @rocket&.doomed?

    time_increment = Unit.new("120 sec")
    loop do
      status = @rocket.fly(time_increment)

      @total_time = @total_time + time_increment

      distance_traveled = status.velocity * time_increment
      @total_distance_traveled = @total_distance_traveled + distance_traveled

      distance_remaining = @mission.distance - @total_distance_traveled
      remaining_time = distance_remaining / status.velocity

      status_update(fuel_burn_rate: status.fuel_burn_rate,
                    velocity: status.velocity,
                    remaining_time: remaining_time)

      if @total_distance_traveled >= @mission.distance
        status_completed
        break
      end
      sleep 1
    end
  end

  private

  def final_status_update_stats
    { mission_uuid: @mission.uuid,
      rocket_uuid: @rocket.uuid,
      total_time_in_seconds: @total_time.scalar,
      total_distance_in_km: @total_distance_traveled.scalar,
      total_fuel_burned_in_liters: @rocket.fuel_used.scalar }
  end

  def status_completed
    broadcast(:flight_simulator_complete_successful, final_status_update_stats)
  end

  def status_aborted
    broadcast(:flight_simulator_complete_aborted, final_status_update_stats)
  end

  def status_exploded
    # Criteria.  Select a random spot on explosions
    total_distance_traveled = @mission.random_point
    total_time = (total_distance_traveled / @rocket.average_speed).round(0)
    total_fuel = @rocket.burn_rate * total_time

    random_stats = final_status_update_stats
      .merge(total_time_in_seconds: total_time.scalar,
             total_distance_in_km: total_distance_traveled.scalar,
             total_fuel_burned_in_liters: total_fuel.scalar)

    broadcast(:flight_simulator_complete_exploded, random_stats)
  end

  def status_update(fuel_burn_rate:, velocity:, remaining_time:)
    time_to_destination = remaining_time.round(0).scalar

    progress = [
      { key: "Current fuel burn rate",
        value: FormatHelpers.unit_with_commas(fuel_burn_rate.convert_to('liters/min')) },
      { key: "Current speed",
        value: FormatHelpers.unit_with_commas(velocity.convert_to("km/h")) },
      { key: "Current distance traveled",
        value: FormatHelpers.unit_with_commas(@total_distance_traveled) },
      { key: "Elapsed time",
        value: FormatHelpers.unit_with_commas(@total_time) },
      { key: "Time to destination", value: FormatHelpers.clock_display(time_to_destination) },
    ]

    broadcast(:flight_simulator_progressed, { mission_uuid: @mission.uuid,
                                              rocket_uuid: @rocket.uuid,
                                              plan: progress })
  end
end
