### Definitions

 - Image: application we want to run
 - Container: process running an instance of an image
 - May containers can run off the same image


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


 
#### Commands
 - run 
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
 - top => docker top nginx
   lists information about the running container
   
   
#### Command analysis: Run
 - docker container run --publish 80:80 --name webhost -d nginx:1.11 nginx -T
                                  host port               version    change CMD run on start    
 - docker container run --publish 80:80 nginx
 1. Look for that image locally
   - if doesn't find go to docker hub to find image and caches locally in download
 2. Creates a new container based on that images, prepares to start
 3. Gives it virtual IP on private network inside docker engine
 4. Opens up port on host and forwards to port 80 in container
 5. Starts using CMD in dockerFile  
   
   
   
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
    
 