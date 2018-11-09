class Bottles
  def song
    verses(99,0)
  end

  def verses(start, fin)
    start.downto(fin).map { |a| verse(a) }.join("\n")
  end

  def verse(bottles)
    case bottles
    when 0
      <<~VERSE_0
        No more bottles of beer on the wall, no more bottles of beer.
        Go to the store and buy some more, 99 bottles of beer on the wall.
      VERSE_0
    when 1
      <<~VERSE_1
        1 bottle of beer on the wall, 1 bottle of beer.
        Take it down and pass it around, no more bottles of beer on the wall.
      VERSE_1
    else
      <<~VERSE
        #{bottles} bottles of beer on the wall, #{bottles} bottles of beer.
        Take one down and pass it around, #{bottles - 1} #{pluralize("bottle", bottles - 1)} of beer on the wall.
      VERSE
    end
  end

  private
  def pluralize(str, num)
    num == 1 ? str : "#{str}s"
  end

end