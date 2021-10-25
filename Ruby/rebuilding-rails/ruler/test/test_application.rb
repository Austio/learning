require_relative "test_helper"
require "pry"
binding.pry
class TestApp < Ruler::Application
end

class RulerAppTest < Test::Unit::TestCase
  def app
    TestApp.new
  end

  def test_request
    get "/"

    assert last_response.ok?
    body = last_response.body
    assert body["Hello"]
  end
end
