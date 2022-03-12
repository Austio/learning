module Doomable
  attr_accessor :_doomable_doomed

  def doomed!
    @_doomable_doomed = true
  end

  def doomed?
    @_doomable_doomed
  end

  def doomable?
    true
  end
end
