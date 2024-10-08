class RocketLauncher
  include Wisper::Publisher
  class InvalidStageError < StandardError; end

  attr_reader :rocket, :mission

  def initialize(rocket:, mission:)
    @rocket = rocket
    @mission = mission
    @prepared = false
    @launched = false
    @launch_finished = false
    @stage = 1
  end

  def launch
    while !@launch_finished
      yield(self, @stage) if block_given?

      break if @launch_finished

      case @stage
      when 1
        engage_afterburner
      when 2
        release_supports
      when 3
        perform_cross_checks
      when 4
        launch!
      else
        raise InvalidStageError.new("Invalid stage #{uuid}")
      end
    end
  end

  def retry!
    publish(:rocket_launcher_retried, { uuid: uuid })
    @stage = 1
  end

  def uuid
    @rocket.uuid
  end

  def finished!
    @launch_finished = true
  end

  def launched?
    @launch_finished && @rocket.launched?
  end

  private

  def transition!
    @stage = @stage + 1
  end

  def engage_afterburner
    if IO.ask_yes_no("Engage afterburner?")
      transition!
      publish(:rocket_launcher_stage_completed, uuid: uuid, stage: :afterburner_engage)
    else
      finished!
      publish(:rocket_launcher_stage_aborted, uuid: uuid, stage: :afterburner_engage)
    end
  end

  def release_supports
    if IO.ask_yes_no("Release support structures?")
      transition!
      publish(:rocket_launcher_stage_completed, uuid: uuid, stage: :support_structures_release)
    else
      retry!
      publish(:rocket_launcher_stage_aborted, uuid: uuid, stage: :support_structures_release)
    end
  end

  def perform_cross_checks
    if IO.ask_yes_no("Perform cross-checks?")
      transition!
      publish(:rocket_launcher_stage_completed, uuid: uuid, stage: :cross_check)
    else
      retry!
      publish(:rocket_launcher_stage_aborted, uuid: uuid, stage: :cross_check)
    end
  end

  def launch!
    if IO.ask_yes_no("Launch?")
      publish(:rocket_launcher_stage_completed, uuid: uuid, stage: :launch)

      @rocket.launch!
    else
      publish(:rocket_launcher_stage_aborted, uuid: uuid, stage: :launch)
    end

    finished!
  end
end
