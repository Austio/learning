class FormatHelpers
  class << self
    def clock_display(seconds)
      seconds = seconds.to_int

      hours = seconds / 3600
      seconds = seconds - (hours * 3600)

      minutes = seconds / 60
      seconds = seconds - (minutes * 60)

      "#{pad_clock_number(hours)}:#{pad_clock_number(minutes)}:#{pad_clock_number(seconds)}"
    end

    def pad_clock_number(num)
      num = num.to_s

      case num.length
      when 0
        "00"
      when 1
        "0#{num}"
      else
        num
      end
    end

    def unit_with_commas(unit)
      with_commas = unit.scalar.to_i.to_s.chars.reverse.each_slice(3).map(&:join).join(',').reverse

      "#{with_commas} #{unit.units}"
    end

    #{ foo: 'bar', bizzy: 'baz'}
    #
    # foo:    bar
    # bizzy:  baz
    def print_left_justified_key_values_with_padding(key_value_hash)
      max_key_length = key_value_hash.map do |h|
        h[:key].to_s.length
      end.max

      key_value_hash.each do |item|
        padding = " " * (max_key_length - item[:key].length)

        puts "  #{item[:key]}:#{padding}  #{item[:value]}"
      end
    end
  end
end
