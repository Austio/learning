class MissionDoomedScenario
  def initialize
    @is_doomed = RandomSelector.is_critical_failure?(dice_sides: 1)
  end

  def check_if_doomed?
    return unless @should_abort_mission

    if target_abort_stage_uuid == stage.uuid
      $io.write('---- System Error: aborting mission')
      $io.write('---- please retry')
      @mission.abort!
    end
  end

  private

  def target_abort_stage_uuid
    return @target_abort_stage_uuid if defined? @target_abort_stage_uuid

    possible_stages = @stages.select{|a| a.name != "AfterBurner"}

    @target_abort_stage_uuid = RandomSelector.pick_one_of(possible_stages).uuid
  end
end
