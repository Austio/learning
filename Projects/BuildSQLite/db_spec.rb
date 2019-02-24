require 'securerandom'

describe 'database' do
  before(:all) do
    %x( gcc -o db ./db.c )
  end

  def run_script(commands, db_name = "#{Time.now.to_i}_#{SecureRandom.hex}")
    raw_output = nil
    IO.popen("./db #{db_name}", "r+") do |pipe|
      commands.each do |command|
        pipe.puts command
      end

      pipe.close_write

      # Read entire output
      raw_output = pipe.gets(nil)
    end
    raw_output.split("\n")
  end
  #
  # before(:each) {
  #   run_script([".clear"]);
  # }

  it 'inserts and retreives a row' do
    result = run_script([
      "insert 1 user1 person1@example.com",
      "select",
      ".exit",
    ])
    expect(result).to match_array([
      "db > Executed.",
      "db > (1, user1, person1@example.com)",
      "Executed.",
      "db > ",
    ])
  end

  it 'prints error message when table is full' do
    script = (1..1401).map do |i|
      "insert #{i} user#{i} person#{i}@example.com"
    end
    script << ".exit"
    result = run_script(script)
    expect(result[-2]).to eq('db > Error: Table full.')
  end

  # We allocated 255 bytes for the strings.
  #  C strings require a terminal null byte https://www.cprogramming.com/tutorial/c/lesson9.html
  it 'allows inserting strings that are the maximum length' do
    long_username = "a"*32
    long_email = "a"*255
    script = [
      "insert 1 #{long_username} #{long_email}",
      "select",
      ".exit",
    ]
    result = run_script(script)
    expect(result).to match_array([
      "db > Executed.",
      "db > (1, #{long_username}, #{long_email})",
      "Executed.",
      "db > ",
    ])
  end

  it 'does not allow inserting strings longer than the maximum length' do
    long_username = "a"*33
    long_email = "a"*256
    script = [
      "insert 1 #{long_username} #{long_email}",
      "select",
      ".exit"
    ]
    result = run_script(script)
    expect(result).to match_array([
      "db > String is too long.",
      "db > Executed.",
      "db > "
    ])
  end

  it "does not allow negative ids" do
    script = [
      "insert -1 a b",
      "select",
      ".exit"
    ]
    result = run_script(script)
    expect(result).to match_array([
      "db > ID must be positive.",
      "db > Executed.",
      "db > "
    ])
  end

  it "persist data after closing connection" do
    db_name = Time.now.to_i

    username = "me"
    email = "a@me.com"
    script = [
        "insert 1 #{username} #{email}",
        "select",
        ".exit"
    ]
    returns = [
        "db > Executed.",
        "db > (1, #{username}, #{email})",
        "Executed.",
        "db > ",
    ]
    result = run_script(script, db_name)
    expect(result).to match_array(returns)

    script1 = [
        "select",
        ".exit"
    ]

    returns1 = [
        "db > (1, #{username}, #{email})",
        "db > ",
        "Executed."
    ]
    result1 = run_script(script1, db_name)
    expect(result1).to match_array(returns1)
  end
end