class EventMissionReporter
  def initialize
    @missions = []
    @retries = 0
    @aborts = 0
    @explosions = 0
    @successes = 0
    @finished_missions = []
  end


  def flight_simulator_complete_aborted(payload)
    @aborts = @aborts + 1

    @finished_missions << payload

    IO.put('Mission Aborted:')
    say_mission_finished_stats(payload)
  end

  def flight_simulator_complete_successful(payload)
    @successes = @successes + 1

    @finished_missions << payload

    IO.put('Mission Success:')
    say_mission_finished_stats(payload)
  end

  def flight_simulator_complete_exploded(payload)
    IO.put('')
    IO.put('*** ****** ***')
    IO.put('***        ***')
    IO.put('*** BOOOM! ***')
    IO.put('***        ***')
    IO.put('*** ****** ***')
    IO.put('', 'A rocket exploded.  Please Try again :)','')
    @explosions = @explosions + 1

    @finished_missions << payload

    IO.put('Mission Exploded:')
    say_mission_finished_stats(payload)
  end

  def flight_simulator_progressed(payload)
    IO.put("Mission Status:")
    payload[:plan].each do |item|
      puts "  #{item[:key]}:  #{item[:value]}"
    end
  end

  def mission_control_completed
    require 'pry'
    distance = @finished_missions.sum(0) do |mission|
      mission[:total_distance_in_km]
    end
    distance = Unit.new("#{distance} km").round(2)

    flight_time = @finished_missions.sum(0) do |mission|
      mission[:total_time_in_seconds]
    end

    liters = @finished_missions.sum(0) do |mission|
      mission[:total_fuel_burned_in_liters]
    end
    liters = Unit.new("#{liters} liters").round(2)

    kv = [
      { key: "1. Total distance traveled",
        value: FormatHelpers.unit_with_commas(distance)},
      { key: "2. Number of abort and retries",
        value: @aborts + @retries},
      { key: "3. Number of explosions",
        value: @explosions },
      { key: "4. Total fuel burned",
        value:  FormatHelpers.unit_with_commas(liters)},
      { key: "5. Total flight ime",
        value: FormatHelpers.clock_display(flight_time) },
    ]

    FormatHelpers.print_left_justified_key_values_with_padding(kv)
  end

  # Mission Plan:
  #   Travel distance:  160.0 km
  #   Payload capacity:  50000 kg
  #   Fuel capacity:  50000 kg
  #   Burn rate:  168240 liters/min
  #   Average speed:  1500 km/h
  def mission_planned(payload)
    IO.put("Mission Plan:")

    FormatHelpers.print_left_justified_key_values_with_padding(payload[:plan])
  end

  def rocket_launcher_retried(payload)
    @retries = @retries + 1
  end

  # {:uuid=>"78f56f90-3579-497e-a57d-9f680d8e8e16", :stage=>:afterburner}
  def rocket_launcher_stage_completed(payload)
    return unless payload.is_a? Hash

    case payload[:stage]&.to_sym
    when :afterburner_engage
      IO.put("Afterburner engaged!")
    when :support_structures_release
      IO.put("Support structures released!")
    when :cross_check
      IO.put("Cross-checks performed!")
    when :launch
      IO.put("Launched!")
    end
  end

  def rocket_launcher_stage_aborted(payload)
    case payload[:stage]&.to_sym
    when :rocket_malfunction_abort_check
      IO.put("*** Problem in preflight check retrying launch ***")
    end
  end

  private

  def say_mission_finished_stats(mission)
    distance = Unit.new("#{mission[:total_distance_in_km]} liters").round(2)

    IO.put("  Total Travel time: #{FormatHelpers.clock_display(mission[:total_time_in_seconds])}")
    IO.put("  Total Distance: #{FormatHelpers.unit_with_commas(distance)}")
  end
end
