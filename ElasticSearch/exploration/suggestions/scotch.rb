require 'elasticsearch'
require 'csv'

client = Elasticsearch::Client.new log: true

client.indices.put_mapping type: 'scotch', body: {
    scotch: {
        name: "String",
        category: "String",
        review: "Number",
        price: "Float",
        currentcy: "String",
        description: "String"
    }
}

CSV.read_lines("#{__FILE__}/scotch_review.csv") do

end
