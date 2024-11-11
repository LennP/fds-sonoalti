# FDS Sonoalti

To build using a Docker file:

```
DOCKER_BUILDKIT=1 docker build -f Dockerfile.build --target export --output type=local,dest=./dist . && \
find ./dist -mindepth 1 -maxdepth 1 ! -name 'app' -exec rm -rf {} + && \
mv ./dist/app/* ./dist/ && rmdir ./dist/app
```
