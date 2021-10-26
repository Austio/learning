require "ruler"

$LOAD_PATH << File.join(File.dirname(__FILE__), "..", "app", "controllers")
require "quotes_controller"

module BestQuote
  class Application < Ruler::Application
  end
end
