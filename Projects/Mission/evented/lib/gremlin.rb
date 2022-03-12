class Gremlin
  include Wisper::Publisher

  def initialize
    @should_explode = rand(1..5) == 1
    @should_abort = rand(1..3) == 1

    if @should_abort
      @abort_at_stage = [2,3].sample
    end
  end

  def check(rocket_launcher, stage)
    if @should_abort && stage == @abort_at_stage
      publish(:rocket_malfunction, uuid: rocket_launcher.uuid)
      rocket_launcher.retry!
      @should_abort = false
    end

    if @should_explode && stage == 4
      return unless rocket_launcher.rocket&.doomable?

      rocket_launcher.rocket.doomed!
    end
  end
end
