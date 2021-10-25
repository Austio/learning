require "ruler/version"
require "ruler/array"

module Ruler
  class Error < StandardError; end

  class Application
    def call(env)
      `echo debug > debug.txt`
      `echo #{[1,2,3].sum_sum} > debug.txt`
      [200, {'Content-Type' => 'text/html'}, ["HIYA!"]]
    end
  end
end
