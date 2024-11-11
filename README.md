# FDS Sonoalti

To build using a Docker file:

```
DOCKER_BUILDKIT=1 docker build -f Dockerfile.build --target builder --output type=local,dest=./dist .
```