module Ruler
  class Application
    def get_controller_and_action(env)
      _, cont, action, after = env["PATH_INFO"].split('/', 4)
      cont = "#{cont.capitalize}Controller"

      [Object.const_get(cont), action]
    end
  end
end
