def decompress(string = "", expansion = [])
  car = string[0]

  return "" if !car || car.empty?
  cdr = string[1..-1]

  case car
  when /\d/
    expansion.push(car)
  when "[" #continue
  when "]"
    last_expansion = expansion.pop
    expanded = (last_expansion[1..-1] || "") * last_expansion[0].to_i

    if expansion.length == 0
      return expanded + decompress(cdr, expansion)
    else
      expansion.last.concat expanded
    end
  else #alphanumeric
    if expansion.length == 0
      return car + decompress(cdr)
    else
      expansion.last.concat(car)
    end
  end

  return decompress(cdr, expansion)
end
