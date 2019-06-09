#!/bin/bash
VOLUMES="-v $(pwd)/package.json:/opt/server/package.json -v $(pwd)/package-lock.json:/opt/server/package-lock.json -v src:/opt/server/src" 

docker run $VOLUMES -ti pringon/express-typescript npm ci && jest
