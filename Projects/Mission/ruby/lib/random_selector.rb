class RandomSelector
  def initialize(out_of:)
    @out_of = out_of
    @percentage = 1.to_f / out_of.to_f
  end

  def self.is_critical_failure?(dice_sides: 6)
    rand <= 1.to_f / dice_sides
  end

  def self.pick_one_of(items)
    items.sample
  end

  def gamble
    rand <= @percentage
  end

  def pick_one
    rand(@out_of)
  end
end
