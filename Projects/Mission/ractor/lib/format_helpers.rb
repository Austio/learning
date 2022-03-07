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
  end
end
