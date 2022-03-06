class Gremlin
  include Wisper::Publisher

  def initialize
    @should_explode = true || rand(1..5) == 1
    @should_abort = true || rand(1..3) == 1

    if @should_abort
      @abort_at_stage = [2,3].sample
    end
  end

  def check(rocket_launcher, stage)
    if @should_abort && stage == @abort_at_stage
      rocket_launcher.retry!
      @should_abort = false
      publish(:rocket_stage_aborted, uuid: rocket_launcher.uuid, stage: :gremlin_abort_check)
    end

    if @should_explode && stage == 4
      rocket_launcher.finished!
      publish(:rocket_stage_aborted, uuid: rocket_launcher.uuid, stage: :gremlin_abort_explosion)
    end
  end
end
