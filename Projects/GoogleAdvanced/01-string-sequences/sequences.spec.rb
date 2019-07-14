# https://techdevguide.withgoogle.com/paths/advanced/compress-decompression/#code-challenge
#

require 'pry'

describe 'Compression/Decompression' do
  before(:all) do
    %x( gcc -o sequences ./sequences.c )
  end
  #
  # after(:all) do
  #   %x( rm sequences )
  # end

  def run_script(commands)
    raw_output = nil
    IO.popen("./sequences #{commands}", "r+") do |pipe|
      pipe.close_write

      raw_output = pipe.gets(nil)
    end

    raw_output.split("\n")[0]
  end

  it 'handles uncompressed strings' do
    r = run_script('abc')

    expect(r).to eql('abc')
  end

  it 'decompresses single' do
    r = run_script('3[abc]')

    expect(r).to eql('abcabcabc')
  end
end