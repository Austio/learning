# https://techdevguide.withgoogle.com/paths/advanced/compress-decompression/#code-challenge
#

require 'pry'
require './sequences.rb'

describe 'Compression/Decompression' do
  before(:all) do
    %x( gcc -o sequences ./sequences.c )
  end
  #
  # after(:all) do
  #   %x( rm sequences )
  # end

  def c_expect(commands, expected)
    raw_output = nil
    IO.popen("./sequences #{commands}", "r+") do |pipe|
      pipe.close_write

      raw_output = pipe.gets(nil)
    end

    r = raw_output.split("\n")[0]
    expect(r).to eql(expected)
  end

  def ruby_expect(input, expected)
    a = decompress(input)
    expect(a).to eql(expected)
  end

  it 'handles uncompressed strings' do
    expected = ['abc', 'abc']
    c_expect(*expected)
    ruby_expect(*expected)
  end

  it 'decompresses single' do
    expected = ['3[abc]', 'abcabcabc']
    c_expect(*expected)
    ruby_expect(*expected)
  end

  it "handles sequences of 0" do
    expected = ['a3[]', 'a']
    c_expect(*expected)
    ruby_expect(*expected)
  end

  it "handles nested sequences" do
    expected = ['a3[b2[e]]', 'abeebeebee']
    c_expect(*expected)
    ruby_expect(*expected)
  end
end