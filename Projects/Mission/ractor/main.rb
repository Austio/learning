require 'securerandom'
require 'wisper'
require 'ruby-units'
require './lib/io'
require './lib/modules/has_uuid'
require './lib/flight_simulator'
require './lib/mission'
require './lib/rocket'
require './lib/rocket_launcher'
require './lib/gremlin'

# TODO convert this to a ractor
class MissionStatusEvents
  def initialize
    @events = []
  end

  def method_missing(symbol, *args)
    @events.unshift({ event: symbol, data: args })

    IO.put("*** STATUS #{symbol} #{args}")
  end

  def respond_to_missing?(symbol, *args)
    return true
  end
end

class MissionListener
  def initialize
    @missions = []
    @retries = 0
    @aborts = 0
  end

  def rocket_launcher_retried(payload)
    @retries = @retries + 1
  end

  def flight_simulator_complete_aborted(payload)
    @aborts = @aborts + 1
  end

  # Mission Plan:
  #   Travel distance:  160.0 km
  #   Payload capacity:  50000 kg
  #   Fuel capacity:  50000 kg
  #   Burn rate:  168240 liters/min
  #   Average speed:  1500 km/h
  def mission_planned(payload)
    IO.put("Mission Plan:")
    payload[:plan].each do |item|
      puts "  #{item[:key]}:  #{item[:value]}"
    end
  end

  def flight_simulator_progressed(payload)
    IO.put("Mission Status:")
    payload[:plan].each do |item|
      puts "  #{item[:key]}:  #{item[:value]}"
    end
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
end

class MissionController
  include Wisper::Publisher

  def start
    Wisper.subscribe(MissionListener.new)
    # Wisper.subscribe(MissionStatusEvents.new)

    IO.put("Welcome to Mission Control!")

    continue = true

    while continue
      mission = Mission.new

      begin
        mission.run!
        continue = IO.ask_yes_no("Would you like to run another mission?")
      rescue Mission::MissionFailureError => error
        broadcast(:rocket_mission_error, mission.uuid, error.class.to_s)

        continue = IO.ask_yes_no("Would you like to run another mission?")
      end
    end
  end
end

MissionController.new.start
