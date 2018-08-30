[Course Repo] (https://github.com/BretFisher/udemy-docker-mastery)

### Definitions

 - Image: application we want to run
 - Container: process running an instance of an image
 - May containers can run off the same image

 - alpine: super tiny security focused distribution

#### Containers
these are really just a process running on the OS

```
docker run --name mongo -d mongo

ps -aux | grep mongo
999      15154  2.9  0.1 1085328 73396 ?       Ssl  11:59   0:00 mongod --bind_ip_all
talos    15297  0.0  0.0  14432  1052 pts/3    S+   11:59   0:00 grep --color=auto mongo

docker top mongo
UID   PID    PPID    C   STIME  TTY  TIME      CMD
999   15154  15132   0   11:59  ?    00:00:01  mongod --bind_ip_all
```
### Commands 
 
#### Management
 - start (start one or more stopped containers)
 - run (run command in a *new* container)
   => docker container run --publish 80:80 nginx
   --detach (-d) 
   --name give it a name to connect with in the future
   --env (-e) pass in environmental variables
   
 - stop => docker container stop   
 - ls
   => show current: docker container ls
   => show all history: docker container ls -a
   id: unique for container
   name: unique for container, but is something we can create
 - rm
   => delete non running containers: docker container rm
   => delete force: docker container rm -f
   
#### Monitoring
 - top => docker top nginx
   lists information about the running container
 - docker container inspect (container name)
   lists information about how a container was started
 - docker container stats (container name)
   live updating ability to see resources
  
#### Connecting
  - run -it
    start new container and the command to execute interactively.  So for instance on this you can see that we have told nginx to run with the bash instead of the default command we have in docker
```
docker container run -it --name proxy nginx bash

talos@Talos-Desktop:~/projects/learning$ docker container ls -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                     PORTS                NAMES
be83299c5b34        nginx               "bash"                   17 seconds ago      Exited (0) 7 seconds ago                        proxy
8b309018883b        nginx               "nginx -g 'daemon of…"   3 hours ago         Up 6 minutes               0.0.0.0:80->80/tcp   nginx

```
  - exec -it
    run additional command in existing container
```
docker exec -it nginx bash
# gives me a bash process inside of any container
```    
      
  -i -> keep it open
  -t -> tty like ssh
  
##### Command analysis: Run
 - docker container run --publish 80:80 --name webhost -d nginx:1.11 nginx -T
                                  host port               version    change CMD run on start    
 - docker container run --publish 80:80 nginx
 1. Look for that image locally
   - if doesn't find go to docker hub to find image and caches locally in download
 2. Creates a new container based on that images, prepares to start
 3. Gives it virtual IP on private network inside docker engine
 4. Opens up port on host and forwards to port 80 in container
 5. Starts using CMD in dockerFile  
 
#### Networking
 - docker container port webhost (show the ports exposed on the thing)
 - docker container inspect --format '{{ .NetworkSettings.IPAddress }}' webhost
   - show me the ip address on one of these containers
 - docker network ls 
 - docker network inspect
 - docker network create --driver
 - docker network connect (equivalent of putting a nic on it live, dynamically creates a nic in a container on an existing virtual network)
 - docker network disconnect  
    
### Networking
Defaults
 - Each container connects to a private virtual network "bridge"
 - Each virtual network routes through NAT firewall on the host IP
 - All containers on a virtual network can talk to each other
 - Best Practices is to create a new virtual network for each "app"
   - "my_web_app" mysqsl/php/apache
   - "api" for mongo nodejs
   
- On boot
 When you start, docker connects all containers to the bridge network /docker0 and those containers can talk however they want
 
Networks:
 - bridge: default, uses nat
 docker network inspect bridge
 - host: skips virtual network and connects direct to the interface
 docker network inspect bridge
 - none: removes eth0 and only leaves with localhost
 docker network inspect bridge
 
Drivers: 
 - bridge: default network when creating a new one, has same properties as bridge network (auto increments subnet)

DNS: 
 - Docker daemon has a build-in dns server that containers use
 - Automatic name resolution internetwork using container names (do not use ip addresses)
 - Docker defaults hostname to containers name, but you can set aliases
 - note: `bridge` network does NOT have dns resolution by default, but you can link them to each other using `--link`
 
```
docker container run --name nginx --publish 80:80 nginx
docker container run --name nginx_2 --publish 81:80 nginx

docker exec -it nginx ping nginx_2
``` 
### Images

What are they
 - file system changes and metadata
 - each layer of an image is read only and have their own SHA so that it is only stored once on any system 
 - A *container* is just a single read/write layer on top of a container
 - app binaries and dependencies
 - metadata about image data and how to run
 - official: "ordered collection of root file system changes and execution parameters for use in container runtime"   
 - NOT: complete OS. no kernel, kernel modules  

DockerHub
 - Official Repos don't have a `slash` docker actually has team that upkeeps them and config/docs
 - tags: alpine
 
Layers
 - Uses union file system to record series of changes
   - Each step in a dockerfile or commit creates the equivalent of a new image in the file system that additional changes are added to
   - Think of it as git for containers
   - Base (child) images are read only, writing is supported by copy on write
  - copy on write
   - when you change a file from the base image, it copies the file up to the child and saves it
   

 View history metadata 
```
docker image ls
docker history (one from above)

IMAGE               CREATED             CREATED BY                                      SIZE                COMMENT
735f80812f90        3 days ago          /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B                  
<missing>           3 days ago          /bin/sh -c mkdir -p /run/systemd && echo 'do…   7B                  
<missing>           3 days ago          /bin/sh -c sed -i 's/^#\s*\(deb.*universe\)$…   2.76kB              
<missing>           3 days ago          /bin/sh -c rm -rf /var/lib/apt/lists/*          0B                  
<missing>           3 days ago          /bin/sh -c set -xe   && echo '#!/bin/sh' > /…   745B                
<missing>           3 days ago          /bin/sh -c #(nop) ADD file:4bb62bb0587406855…   83.5MB  

docker image inspect (one from above)
``` 
 
Tagging/Docker Hub
 - point to an image id
 - are pushed up to dockerhub
 - latest (generally) means most recent version
 
 `docker image tag SOURCE:tag TARGET:tag` 

## DockerFile
 - Keep things that change the least at top of dockerfile
   - When building, all the steps are cachable, but on a change it must rerun every step after that change from cache
  
## Data Persistence
 - Containers are ephemeral and immutable, we don't change things once they are running `immutable infrastructure`
 - `persistent data` how does that work with autoscaling
   - volumes: special location outside of container for storage 
   - bind mounts: link a container path to a host path
    
### Volumes
  declare inside of dockerfile as `VOLUMES` they persist the life of the container.  These are wired up in the container meta
  - Be sure to name volumes otherwise very hard for others to use
  
```
docker container inspect foo

{ 
  "Mounts": { ...detailsOnYourConnection },
  "Volumes": { ...The volumes you list }
}
```

### Persistent Data
  - map a host file or directory to a container file or directory
  - two location pointing to the same file
  - cant use docker file, must use docker run
    - run -v /User/austio/mysql-db:/path/container
  - publish 8080, use the current working directory as the html nginx  
    - `docker container run -d --name nginx -publish 80:80 -v $(pwd):/usr/share/nginx/html nginx`
    - when you make changes to `pwd` all of them are synced to the volume


### Docker Compose
 -yaml and cli tool

#### YML File
 - services (containers)
  - image
  - command (override docker CMD)
  - environment (env vars)
  - volumes (can append :ro to get read only file copied on bind mount)
  - deponds_on 
 - volumes
 - networks

#### CLI
 - up (start and get going)
 - down (stop stuff)
 - build
 
#### Build

You can build a docker image if it is not in cache using the `build` key.  This will first check cache and then build it using the dockerfile if it is not present

*NOTE* - SHARP EDGES
if you use this and need to rebuild use
 docker-compose up --build
 or
 docker-compose build
 
 

## Assignments
 
### Containers
 - Setup multiple containers on different processes, apache (8080), nginx (80) and mysql (3306)
 
```
docker container run --publish 80:80 --name nginx -d nginx
docker container run --publish 8080:80 --name httpd -d httpd
docker container run --name mysql --publish 3306:3306 -d mysql

docker container ls
docker ps

docker container stop nginx httpd mysql
``` 

### Networks
 - Setup multiple containers and communicate between them
 
```
docker network create testing

docker container run -it --network testing --name ubuntu_1 ubuntu
docker container run -it --network testing --name ubuntu_2 ubuntu
``` 

 - DNS Round Robin, give net-alias search
2 elasticsearch images, alias with `--network-alias` when creating them to give them additional DNS name
run alipine nslookup search --net to see the two containers
curn centos curl -s search:9200 with --net multiple times until you see both name fields 
```
docker network create testing
docker container run --name es1 --network-alias search --network testing elasticsearch
docker container run --name es2 --network-alias search --network testing elasticsearch

$ docker container run --network testing alpine nslookup search
  Name:      search
  Address 1: 172.25.0.3 es2.testing
  Address 2: 172.25.0.2 es1.testing

MULTIPLE TIMES RUN
$ docker container run --network testing centos curl -s search:9200
``` 

### Compose Files
- build compose file for drupal/postgres
   - up:   `docker-compose -f 54_drupal_compose.yml up`
   - down: `docker-compose -f 54_drupal_compose.yml down -v -rmi` (remove volumes, remove images)

- build custom yml file