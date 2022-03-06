class IO
  class << self
    def put(*args)
      args.each &method(:puts)
    end

    def get(question)
      put(question)
      gets
    end

    def ask_yes_no(question)
      response = get("#{question} (Y/n)").chomp

      if response == "Y"
        true
      elsif response == "n"
        false
      else
        put("Input Error: You must answer 'Y' or 'n'")
        ask_yes_no(question)
      end
    end
  end
end
