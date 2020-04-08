class Mission
  attr_reader :name

  def initialize(name:, vehicle:)
    @name = name
    @distance_in_meters = 160000
    @payload_in_grams = 50000000
    @vehicle = vehicle

    @aborted = false
    @prepared = false
  end

  def distance_traveled
    0
  end

  def total_travel_time
    0
  end

  def ready_for_launch?
    @prepared
  end

  def abort!
    @aborted = true
  end

  def prepare
    puts "Mission #{@name} beginning"

    stages.each do |stage|
      yield(stage: stage, mission: self) if block_given?

      break if @aborted

      stage.run
    end
  end

  def launch
    $io.write('launching')
  end

  def stages
    return @stages if defined? @stages

    @stages = [
        Stage.new(name: "AfterBurner",
                  work: lambda do |stage|
                    if $io.ask_binary_question("Engage afterburner?")
                      $io.write("Afterburner engaged!")
                    else
                      abort!
                    end
                  end),
        Stage.new(name: "DisengageReleaseStructure",
                  work: lambda do |stage|
                    if $io.ask_binary_question("Release support structures?")
                      $io.write("Support structures released!")
                    else
                      abort!
                    end
                  end),
        Stage.new(name: "CrossCheck",
                  work: lambda do |stage|
                    if $io.ask_binary_question("Perform cross-checks?")
                      $io.write("Cross-checks performed!")
                    else
                      abort!
                    end
                  end),
        Stage.new(name: "Launch",
                  work: lambda do |stage|
                    if $io.ask_binary_question("Launch?")
                      $io.write("Launched")
                    else
                      abort!
                    end
                  end)
    ]
  end
end