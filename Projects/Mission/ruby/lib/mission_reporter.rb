class MissionReporter
  def initialize
    @missions = []
  end

  def notify(message, payload = nil)
    case message
    when 'mission_aborted'
      $io.write('---- System Error: aborting mission')
      $io.write('---- please retry')
    when 'mission_complete'
      add_mission(payload)
      print_mission_summary(payload)
    when 'game_complete'
      print_final_mission_summary
    when 'mission_progress'
      print_mission_progress(payload)
    end
  end

  def print_mission_progress(mission)
    puts mission.name
  end

  def add_mission(mission)
    @missions.push(mission)
  end

  def print_mission_summary(mission)
    puts <<-SUMMARY
    -- Mission #{mission.name} Complete
    1. Total distance traveled #{mission.distance_traveled}
    2. Total travel time #{mission.total_travel_time}
    SUMMARY
  end

  def print_final_mission_summary
    puts @missions.length
  end
end