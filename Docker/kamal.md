### [Kamal](https://kamal-deploy.org/) 

Kamal is a tool for deploying docker containers to servers. It is a wrapper around the docker cli and docker-compose.

#### Setup

`kamal setup`
 - Ensure the server is not locked and has docker setup
 - Upload the Env files
 - Create and start accessories (eg db, redis, etc)
 - run the 'deploy' command

```
desc "setup", "Setup all accessories, push the env, and deploy app to servers"
def setup
  # yields the block and adds the time it took to the output
  print_runtime do
    # mutating
    #  - checks that Kamal does not have a 'lock' (See #### Locking)
    #  - run the `pre-connect` hook that you define int he `.kamal` directory
    #  - create the 'run' directory on the remote server
    #  - acquire a deployment 'lock' on the server 
    #  - yield the block
    # if mutating fails, it will either keep the lock in place or remove it based on `KAMAL.hold_lock_on_error?`
    mutating do
      say "Ensure Docker is installed...", :magenta
      # kamal:cli:server:bootstrap aka - Kamal::Cli::Server 
      # - Ensures that docker is installed on the server
      # - Ensure that we have root access
      # if this fails it will print a message that docker couldn't be installed
      invoke "kamal:cli:server:bootstrap"
      
      # kamal:cli:env:push - Kamal::Cli::Env
      # - Create an env directory on each server
      # - Push the local .env file to the server
      say "Push env files...", :magenta
      invoke "kamal:cli:env:push"

      # accessories are like db, redis, etc
      # kamal:cli:accessory:boot - Kamal::Cli::Accessory
      # - for each accessory
      # - upload and add permissions for 'directories'
      # - upload and add permissions for the 'files'
      # - use docker :run with lots of options for the container
      # https://github.com/basecamp/kamal/blob/539752e9bd56d752ad6d01e9044cdc7f47149881/lib/mrsk/commands/accessory.rb#L11 
      # eg file
      #  db:
      #    image: postgres:15
      #    host: 165.227.160.215
      #    port: 5432
      #    env:
      #      clear:
      #        POSTGRES_USER: "myapp"
      #        POSTGRES_DB: 'myapp_production'
      #      secret:
      #        - POSTGRES_PASSWORD
      #    files:
      #      - config/init.sql:/docker-entrypoint-initdb.d/setup.sql
      #    directories:
      #      - data:/var/lib/postgresql/data
      invoke "kamal:cli:accessory:boot", [ "all" ]
      
      
      deploy
    end
  end
end  
```

#### Locking

On the server, the lock for a deployment is managed with the `Lock` class, it reads and writes a file on the `lock_dir` and `lock_file` with a "message".  By default tha tmessage is "automatic deploy lock"

Clearing the lock, removes that file.

```
# Kamal::Cli::Base
def acquire_lock
  raise_if_locked do
    say "Acquiring the deploy lock...", :magenta
    on(KAMAL.primary_host) { execute *KAMAL.lock.acquire("Automatic deploy lock", KAMAL.config.version), verbosity: :debug }
  end

  KAMAL.holding_lock = true
end

# Kamal::Cli::Lock
def write_lock_details(message, version)
  write \
    [:echo, "\"#{Base64.encode64(lock_details(message, version))}\""],
    lock_details_file
end

def lock_dir
  "#{config.run_directory}/lock-#{config.service}"
end

def lock_details_file
  [lock_dir, :details].join("/")
end
```
