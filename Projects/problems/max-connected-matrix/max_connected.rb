class Matrix
  class Node
    attr_reader :value

    def initialize(v, column:, row:)
      @value = v
      @column = column
      @row = row
    end

    def ==(other)
      @value == other.value
    end

    def max

    end
  end

  class NullNode < Node

    def ==(other)
      false
    end
  end

  def self.max(matrix)
    return 0 unless matrix

    new(matrix).max
  end

  def initialize(matrix)
    matrix.each_with_index do |row, row_index|
      row.each_with_index do |value, column_index|
        matrix[row_index][column_index] = Node.new(value, row: row_index, column: column_index)
      end
    end

    @matrix = matrix
  end

  def get_node(column:, row:)
    return NullNode(nil, column: column, row: row) if column < 0 || row < 0

    @matrix[column][row] || NullNode(nil, column: column, row: row)
  end

  def max
    max = -1

    @matrix.each do |row|
      row.each do |column|
        if column.max >= max
          max = column.max
        end
      end
    end

    max
  end
end
