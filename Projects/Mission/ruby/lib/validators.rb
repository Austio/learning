class Validators
  Y_OR_N_RESPONSE = Proc.new do |response|
                                                                if response.match /^(Y|n)$/
                                                                    true
                                                                  else
                                                                    $io.write("Response must be 'Y' or 'n'\n")
                                                                    false
                                                                  end
                                                                end
  ANY_LENGTH_RESPONSE = Proc.new do |response|
    if response.length > 0
      true
    else
      $io.write("Response cannot be blank, please input a value")
      false
    end
  end
end
