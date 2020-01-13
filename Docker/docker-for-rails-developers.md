 - Image (factory): Description of an environment (what a container will have)
 - Container (product): Sandboxed, isolated Running instance of an image
 - Base Image: In dockerfiles, the bare minimum images to get thing going.  You can `FROM scratch` to get a base one or [Create your own](https://docs.docker.com/develop/develop-images/baseimages/)

### Architecture

By Default, `docker run` only forwards the containers stdout to our client.

By Default, commands run as root (user 1)

Docker tags are really for naming repo/image and tagging.  `docker tag cID repo:tag`

Lifecycle of a container
 - created - at rest, ready to go
 - running - when you `start` a container, `docker run` creates and then runs
 - stopping - sends SIGTERM to main process in container, falls back to SIGKILL
 - stopped - here after a stop or the main process terminates
   
### Reference
run vs exec
 - run will start a new container, exec will run in the currently executing container

|Flag||
|---|---|
| docker run | ---|
| --rm | Delete the container after running |
| -v ${PWD}:/usr/src/app | Mount a volume at your currect dir to the docker container path /usr/src/app |
| -i | forward input from terminal to docker container |
| -t | create a tty to accept terminal input on docker container |
|-p| expose a port mapping|
| docker build | ---|
| -t REPO_TAG:name| Will tag repo and tag tag for an image while building|

|Command||
|---|---|
| docker run ruby:2.6 ruby -e "puts 'hello'" | pull ruby image and run ruby command |
| docker run --rm ruby:2.6 ruby -e "puts 'hello'" | DITTO by delete container after done |
|docker inspect --format {{ NetworkSettings.IPAddress }} cID | get the ip address of a running container|
|docker run <options> [image:version] \ bash -c "COMMANDS"| allows running multiple commands inside of docker (bash command)|
|docker build [options] path |Build the Dockerimage|
|docker run -p 3000 ID \ bin/rails s -b 0.0.0.0| run rails image, start server and bind it to all ports|
|docker tag cID tag|tags a container with a friendly tag|

|docker-compose|---|
|---|---|
|docker-compose up --force-recreate SERVICE|starts docker container but forces to recreate|
|docker-compose logs -f container|tails the logs of the container (don't confuse with stdout)|
|docker-compose restart container|restarts the container|
|docker-compose run --rm container ~CMD TO RUN~|Runs a command in a new container|
|docker-compose exec container ~CMD TO RUN~|Runs a command in the existing container|
|docker-compose build container|Rebuilds the container|
|pruning|---|
|docker system prune|removes every, damned thing|
|docker image prune|---|
|docker container prune|---|



### Gotchas

#### Order Dependent Commands

Make sure docker files are busting the cache on the step that you want.  Below when we add vim, the `update` command from above will not be ran, which means it will only have the files from apt repo that existed when the command was ran.

```bash
RUN apt-get update
RUN apt-get install -yqq --no-install-recommended nodejs

### Bad, will not update apt
RUN apt-get update
RUN apt-get install -yqq --no-install-recommended nodejs vim

### Fix, run them together
RUN apt-get update && apt-get install -yqq --no-install-recommended \
nodejs \
vim
```

#### COPY

COPY ... will check the files being copied (minus dockerignore) and if they are different will rebuild this step.  This is how a change to something like a README.md could cause an entire app to be rebuilt.

This is bad for things like gem install/npm install because it will cause the entire thing to be rebuilt from scratch.

*TRICK* for Copy, separate the things that cause builds from the source.

```bash
#before
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN bundle install

#after
COPY Gemfile* /usr/src/app
WORKDIR /usr/src/app
RUN bundle install

COPY . /usr/src/app
```

#### STDOUT

By default rails logs to standard out.  [Better Explanation](https://blog.eq8.eu/til/ruby-logs-and-puts-not-shown-in-docker-container-logs.html)

in `config/boot.rb` add this line to to the top
`$stdout.sync = true`

### Rails Dockerfile

```bash
FROM ruby 2.6

LABEL maintainer="me@email.com"

# Dependencies one per line.  Run at same step as update to ensure package repo up to date
RUN apt-get update -yqq && apt-get install -yqq --no-install-recommended \
nodejs

# Copy Gemfile and bundle install first so that code changes don't cause a full rebuild
COPY Gemfile* /usr/src/app
WORKDIR /usr/src/app

RUN bundle install

# all our rails files into the image and set CWD to that path
COPY . /usr/src/app

CMD ['bin/rails', 's', '-b', '0.0.0.0']
# This commented form is bad b/c it will prefix the command with /bin/bash -c
# so killing the process will kill bash and NOT the rails server
# CMD bin/rails s -b 0.0.0.0
```

### Rails docker-compose file

ENV_FILE_DB


```yaml
version '3'

services:
  web:
    build: .
    ports: 
      - "3000:3000"
    volumes: 
      - .:/usr/src/app
    env_file:
      - .env/dev/database
      - .env/dev/web
  redis:
    image: redis
  database:
    image: postgres
    env_file:
      - .env/dev/database
    volumes:
      - db_data:/var/lib/postgresql/data
  
  # to get info from docker volume with location (should be like /var/lib..../myapp_db_data/_data)
  # docker volume inspect --format '{{ .Mountpoint }}' myapp_db_data
  volumes:
    db_data:
```
