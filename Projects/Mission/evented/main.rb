require 'securerandom'
require 'wisper'
require 'ruby-units'
require './lib/io'
require './lib/format_helpers'
require './lib/modules/has_uuid'
require './lib/modules/doomable'
require './lib/event_mission_logger'
require './lib/event_mission_reporter'
require './lib/flight_simulator'
require './lib/gremlin'
require './lib/mission'
require './lib/rocket'
require './lib/rocket_launcher'

Unit.redefine!("liter") do |foobar|
  foobar.display_name = "liters"
end

class MissionController
  include Wisper::Publisher

  def start
    Wisper.subscribe(EventMissionReporter.new)
    # Wisper.subscribe(EventMissionLogger.new)

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

    broadcast(:mission_control_completed)
  end
end

MissionController.new.start
