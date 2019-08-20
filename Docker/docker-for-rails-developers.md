 - Image (factory): Description of an environment (what a container will have)
 - Container (product): Sandboxed, isolated Running instance of an image
 - Base Image: In dockerfiles, the bare minimum images to get thing going.  You can `FROM scratch` to get a base one or [Create your own](https://docs.docker.com/develop/develop-images/baseimages/)

### Architecture

By Default, `docker run` only forwards the containers stdout to our client.

By Default, commands run as root (user 1)

Docker tags are really for naming repo/image and tagging.  `docker tag cID repo:tag` 

### Reference

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


### Rails Dockerfile

```bash
FROM ruby 2.6
RUN apt-get update -yqq
RUN apt-get install -yqq --no-install-recommended nodejs

# Move all our rails files into the image and set CWD to that path
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN bundle install

CMD ['bin/rails', 's', '-b', '0.0.0.0']
# This commented form is bad b/c it will prefix the command with /bin/bash -c
# so killing the process will kill bash and NOT the rails server
# CMD bin/rails s -b 0.0.0.0
```
 --no-install-recommended nodejs vim