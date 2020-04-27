Dir.glob('./lib/**.rb').each {|f| require(f)}
require 'pry'

$notifier = Notifier.new
$io = InputOutput.new

class Game
  def self.start
    GameLoop.new.begin
  end
end

reporter = MissionReporter.new
$notifier.subscribe('mission_complete', reporter)
$notifier.subscribe('mission_aborted', reporter)
$notifier.subscribe('mission_progress', reporter)
$notifier.subscribe('game_complete', reporter)


Game.start
