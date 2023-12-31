### [Kamal](https://kamal-deploy.org/) 

Kamal is a tool for deploying docker containers to servers. It is a wrapper around the docker cli and docker-compose.

#### Setup

`kamal setup`

```
desc "setup", "Setup all accessories, push the env, and deploy app to servers"
def setup
  # yields the block and adds the time it took to the output
  print_runtime do
    # mutating, checks that Kamal does not have a 'lock'
    # run the block 
    mutating do
      say "Ensure Docker is installed...", :magenta
      invoke "kamal:cli:server:bootstrap"

      say "Push env files...", :magenta
      invoke "kamal:cli:env:push"

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
