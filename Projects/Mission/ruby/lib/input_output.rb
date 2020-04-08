
class InputOutput
  def ask_binary_question(question, truthy: "Y", falsey: "n")
    formatted_question = "#{question} (#{truthy}/#{falsey})?"

    response = ask_question(formatted_question, &Validators::Y_OR_N_RESPONSE)

    response == truthy
  end

  def ask_question(question, &validator)
    write question
    response = gets.chomp

    if validator
      a = validator.call(response)

      if !a
        return ask_question(question)
      end
    end

    response
  end

  def write(output)
    puts output
  end
end
