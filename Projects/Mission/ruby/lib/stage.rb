require 'securerandom'

class Stage
  class ArgumentError < StandardError; end;

  attr_reader :name, :uuid

  def initialize(name: nil, work: nil, report: nil)
    @name = name
    @work = work
    @report = report
    @uuid = SecureRandom.uuid

    if !@work.is_a? Proc
      raise ArgumentError.new("work must be a Proc in order to conduct a stage")
    end
  end

  def run
    @work.call(self)
  end
end
