# QA4LAB UI

> QA4Lab UI implementation
 
## Build Setup - Docker

If there are any changes to the packages build base image. from package.json dir

``` bash
# install dependencies
$ docker build -f Dockerfile.base -t qalab-ui:base .
```

To build the application
 
``` bash
# Build application, uses qalab-ui:base image
$ docker build -t qalab-ui:dev .
```

Remove all untagged images

```
docker rmi $(docker images -q --filter "dangling=true")
```
Remove all stopped containers

```
docker rm $(docker ps -a -f status=exited -q)
```
