require 'rspec'
require './max_connected.rb'
require 'pry'

RSpec.describe Matrix do
  it "returns 0 on empty" do
    expect(Matrix.max(nil)).to eql(0)
  end

  it "returns 1 when 1 size matrix" do
    expect(Matrix.max([['B']])).to eql(1)
  end
end
