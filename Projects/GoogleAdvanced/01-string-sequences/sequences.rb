def decompress(string)
  return "" if (string.length <= 0)

  if (string[0] == "]")
    return ""
  end

  if (string[0].match(/\d/))
    puts string[0]
    return decompress(string[2..-1]) * string[0].to_i
  end

  string[0] + decompress(string[1..-1])
end