require "ruler/version"

module Ruler
  class Error < StandardError; end

  class Application
    def call(env)
      `echo debug > debug.txt`
      [200, {'Content-Type' => 'text/html'}, ["Helllooo World"]]
    end
  end
end
