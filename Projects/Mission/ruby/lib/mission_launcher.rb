class MissionLauncher
  def self.launch(mission)
    $notifier.publish('mission_progress', mission)

  end
end