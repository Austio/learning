class GameLoop
  def initialize
    @missions = []
  end

  def begin
    $io.write("Welcome to Mission Control!")

    continue = true
    while continue
      space_craft = SpaceCraft.new
      name = $io.ask_question("What is the name of this mission?", &Validators::ANY_LENGTH_RESPONSE)
      mission = Mission.new(vehicle: space_craft, name: name)
      if $io.ask_binary_question("Would you like to proceed?")
        maybe_abort_mission_strategy = MissionAbortScenario.new(mission)
        mission.prepare do |args|
          maybe_abort_mission_strategy.check_if_failure?(args[:stage])
        end


        if mission.ready_for_launch?
          MissionLauncher.launch(mission) do
            maybe_doomed_mission_strategy = MissionDoomedScenario.new(mission)
            mission.launch do |args|
              maybe_doomed_mission_strategy.check_if_failure?
            end
          end
        end

        $notifier.publish('mission_complete', mission)
      end
      continue = $io.ask_binary_question('Would you like to run another mission?')
    end

    $notifier.publish('game_complete')
  end
end
