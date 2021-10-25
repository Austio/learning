class Array
  def sum_sum(start=0)
    inject(start, &:+)
  end
end
