
require "json"

puts "enter index name"
i = gets.strip

class Person < Struct.new(:name, :current_city,
                          :university_city, :worked_city, :trained_city)
  def to_index
    to_h.to_json
  end
end

build_index = -> (arr, index = "people") do
  arr.inject("") do |acc, curr|
    i = <<~BULK
      {"index":{"_index":"#{index}", "_type": "#{index}"}}
      #{cur.to_index}
    BULK

    acc += i
    acc
  end
end

build_index.call(arr)

jim = Person.new("jim", "San Franscisco", "San Mateo", "San Fernando", "Santa Anna")
jane = Person.new("jane", "Austin", "Houston", "Kansas City", "Chicago")
joe = Person.new("joe", "New York", "Raleigh", "Miami", "Phoenix")

people = [jim, jane, joe]

