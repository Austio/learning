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
    # see #### Mutating
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

#### Deploy

`kamal deploy (-P to skip image build and push)`

- run `mutate` (see #### Mutate)
- login to docker registry
- (if not skipping push) push - build and push the docker image to the registry 
- pull - on each host clean, pull and validate docker image
- run the `pre-deploy` hook
- ensure traefik is running
- if traefik is running, ensure app can pass healthcheck
- stop stale containers
- boot the app

```
runtime = print_runtime do
  # run `mutating` (see #### Mutate)
  mutating do
    # check if we have -P flag
    invoke_options = deploy_options

    say "Log into image registry...", :magenta
    # login to registry using 'docker' cli that is wrapped by kamal
    invoke "kamal:cli:registry:login", [], invoke_options

    if options[:skip_push]
      say "Pull app image...", :magenta
      # build the image and push push the on the servers - clean (docker image rm --force), pull and validate (docker inspect) the docker image
      invoke "kamal:cli:build:pull", [], invoke_options
    else
      say "Build and push app image...", :magenta
      # push and then pull 
      # push
      #  verify_local_dependencies (docker)
      #  run the `pre-build` hook
      #  *warn* if uncommited changes
      #  docker build - docker push 
      # pull
      #  kamal:cli:build:pull (above)
      
      invoke "kamal:cli:build:deliver", [], invoke_options
    end

    run_hook "pre-deploy"

    say "Ensure Traefik is running...", :magenta
    invoke "kamal:cli:traefik:boot", [], invoke_options

    if KAMAL.config.role(KAMAL.config.primary_role).running_traefik?
      say "Ensure app can pass healthcheck...", :magenta
      invoke "kamal:cli:healthcheck:perform", [], invoke_options
    end

    say "Detect stale containers...", :magenta
    invoke "kamal:cli:app:stale_containers", [], invoke_options.merge(stop: true)

    # tag the current image as the latest
    # on each app, extract the assets and sync assets volume
    #   do this by checking if the specializations["asset_path"] exists and then copying assets over
    #     asset_container = "#{role_config.container_prefix}-assets"

    # combine \
    #   make_directory(role_config.asset_extracted_path),
    #   [*docker(:stop, "-t 1", asset_container, "2> /dev/null"), "|| true"],
    #   docker(:run, "--name", asset_container, "--detach", "--rm", config.latest_image, "sleep 1000000"),
    #   docker(:cp, "-L", "#{asset_container}:#{role_config.asset_path}/.", role_config.asset_extracted_path),
    #   docker(:stop, "-t 1", asset_container),
    #   by: "&&"
    invoke "kamal:cli:app:boot", [], invoke_options
    
    *HERE TODO

    say "Prune old containers and images...", :magenta
    invoke "kamal:cli:prune:all", [], invoke_options
  end
end


```
#### Mutating 

When we 'mutate' we are running a command that should only have one changer at a time (so no multiple deploys)

This command does the following:
- checks that Kamal does not have a 'lock' (See #### Locking)
- run the `pre-connect` hook that you define int he `.kamal` directory
- create the 'run' directory on the remote server
- acquire a deployment 'lock' on the server 
- yield the block

if mutating fails, it will either keep the lock in place or remove it based on `KAMAL.hold_lock_on_error?`

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
